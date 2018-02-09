/**
 * Gestion d'une entité mobile dans le labyrinthe
 * Collision
 * Décision
 */

const o876 = require('../../o876');
const Vector = o876.geometry.Vector;
const RC_CONST = require('../consts/raycaster');
const Location = require('./Location');

const FORCE_NORM = 10;


module.exports = class Mobile {
	constructor() {
        // identifiant
		this.id = '';
		// position & angle
		this.location = new Location();
		// vitesse de déplacement
		this.speed = new Vector(0, 0);
		// ensembles des forces appliquées au mobiles
		this._forces = [];
		this._collider = null;
		this._size = 16;
		this.wallCollisions = Vector.zero();
		this._dummy = null;
		// aspect
		this.blueprint = '';
	}

	/**
	 * Permet de supprimer le mobile du collisionner
	 */
	finalize() {
		let cm = this._dummy;
		if (cm) {
			cm.dead(true);
			this._dummy = null;
			this._collider = null;
		}
	}

	/**
	 * setter/getter du collisionneur
	 * @param c {o876.collider.collider}
	 * @returns {*}
	 */
	collider(c) {
		if (!this._dummy) {
			let cm = new o876.collider.Dummy();
			cm._mobile = this;
			this._dummy = cm;
		}
		return o876.SpellBook.prop(this, '_collider', c);
	}

    /**
	 * ajoute une force
     * @param v {Vector} vecteur de force
     * @param f {number} facteur d'atténuation
     */
	force(v, f) {
		this._forces.push([v, f]);
	}

    /**
	 * Somme de toutes les forces agissant sur le système
	 * @return Vector
     */
	forces() {
		return this._forces.reduce((prev, f) => prev.add(f[0]), Vector.zero());
	}

    /**
	 * fait appliquer les forces en bougeant le mobile
	 * toutes les forces diminuent d'intensité selon leur facteur
	 * les forces devenue trop faible (moins de 1% de leur intensité initiale), disparraissent
     */
	applyForces() {
		this.move(this.forces());
        this._forces = this._forces.filter(v => v[0].scale(v[1]).normalize() < 0.01);
	}

    /**
     * Défini la taille physique du mobile, pour les collisions
     * @param n {number}
     */
	size(n) {
		return o876.SpellBook.prop(this, '_size', n);
	}

	/**
	 * Détermine la collision entre le mobile et les murs du labyrinthe
	 * @typedef {Object} xy
	 * @property {number} x
	 * @property {number} y
	 *
	 * @param vPos {Vector} position du mobile. ATTENTION ce vecteur est mis à jour par la fonction !
	 * @param vSpeed {Vector} delta de déplacement du mobile. ATTENTION ce vecteur est mis à jour par la fonction !
	 * @param nSize {number} demi-taille du mobile
	 * @param nPlaneSpacing {number} taille de la grille
	 * (pour savoir ou est ce qu'on s'est collisionné). ATTENTION ce vecteur est mis à jour par la fonction !
	 * @param bCrashWall {boolean} si true alors il n'y a pas de correction de glissement
	 * @param pSolidFunction {function} fonction permettant de déterminer si un point est dans une zone collisionnable
	 */
	static computeWallCollisions(vPos, vSpeed, nSize, nPlaneSpacing, bCrashWall, pSolidFunction) {
		let nDist = vSpeed.distance();
		if (nDist > nSize) {
			let vSubSpeed = vSpeed.normalize().mul(nSize);
			let nModDist = nDist % nSize;
			let r, pos, speed;
			if (nModDist) {
				let vModSpeed = vSpeed.normalize().mul(nModDist);
				r = Mobile.computeWallCollisions(vPos, vModSpeed, nSize, nPlaneSpacing, bCrashWall, pSolidFunction);
				pos = r.pos;
				speed = r.speed;
			} else {
				pos = vPos;
				speed = Vector.zero();
			}
			for (let iIter = 0; iIter < nDist; iIter += nSize) {
				r = Mobile.computeWallCollisions(pos, vSubSpeed, nSize, nPlaneSpacing, bCrashWall, pSolidFunction);
				pos = r.pos;
				speed = speed.add(r.speed);
			}
			return {
				pos,
				speed,
				wcf: r.wcf
			};
		}
		// par defaut pas de colision détectée
		let oWallCollision = {x: 0, y: 0};
		let dx = vSpeed.x;
		let dy = vSpeed.y;
		let x = vPos.x;
		let y = vPos.y;
		// une formule magique permettant d'igorer l'oeil "à la traine", evitant de se faire coincer dans les portes
		let iIgnoredEye = (Math.abs(dx) > Math.abs(dy) ? 1 : 0) | ((dx > dy) || (dx === dy && dx < 0) ? 2 : 0);
		let xClip, yClip, ix, iy, xci, yci;
		let bCorrection = false;
		// pour chaque direction...
		for (let i = 0; i < 4; ++i) {
			// si la direction correspond à l'oeil à la traine...
			if (iIgnoredEye === i) {
				continue;
			}
			// xci et yci valent entre -1 et 1 et correspondent aux coeficients de direction
			xci = (i & 1) * Math.sign(2 - i);
			yci = ((3 - i) & 1) * Math.sign(i - 1);
			ix = nSize * xci + x;
			iy = nSize * yci + y;
			// déterminer les collsion en x et y
			xClip = pSolidFunction(ix + dx, iy);
			yClip = pSolidFunction(ix, iy + dy);
			if (xClip) {
				dx = 0;
				if (bCrashWall) {
					dy = 0;
				}
				oWallCollision.x = xci;
				bCorrection = true;
			}
			if (yClip) {
				dy = 0;
				if (bCrashWall) {
					dx = 0;
				}
				oWallCollision.y = yci;
				bCorrection = true;
			}
		}
		x += dx;
		y += dy;
		if (bCorrection) {
			// il y a eu collsion
			// corriger la coordonée impactée
			if (oWallCollision.x > 0) {
				x = (x / nPlaneSpacing | 0) * nPlaneSpacing + nPlaneSpacing - 1 - nSize;
			} else if (oWallCollision.x < 0) {
				x = (x / nPlaneSpacing | 0) * nPlaneSpacing + nSize;
			}
			if (oWallCollision.y > 0) {
				y = (y / nPlaneSpacing | 0) * nPlaneSpacing + nPlaneSpacing - 1 - nSize;
			} else if (oWallCollision.y < 0) {
				y = (y / nPlaneSpacing | 0) * nPlaneSpacing + nSize;
			}
		}
		return {
			pos: new Vector(x, y),
			speed: new Vector(x - vPos.x, y - vPos.y),
			wcf: oWallCollision
		};
	}

	/**
	 * Mise à jour du Dummy de collision
	 * @returns {null|*}
	 */
	dummy() {
		let cm = this._dummy;
		cm.radius(this._size);
		cm.position(this.location.position());
		this._collider.track(cm);
		return cm;
	}

    /**
     * Teste si le mobile spécifié entre en collision avec un autre mobile.
     */
    computeMobileCollisions() {
    	let cm = this.dummy();
		let aMobHits = this.collider().collides(cm);
		let vPos = this.location.position();
		// ajouter un vecteur force à tous ces mobiles
		aMobHits.forEach(m =>
			this.force(
				vPos.sub(m.position())
					.normalize()
					.scale((cm.radius() + m.radius() - cm.distanceTo(m)) / 2),
				0
			)
		);
    }

    /**
	 * Déplace le mobile selon le vector spécifié
	 * Gestion des collisions
	 * @param {o876.geometry.Vector} vSpeed
	 */
	move(vSpeed) {
		let oLocation = this.location;
        let vPos = oLocation.position();
        let area = oLocation.area();
        this.computeWallCollisions(
            vPos,
            vSpeed,
            this._size,
            RC_CONST.plane_spacing,
            this.wallCollisions,
            false,
            (x, y) => area.isSolidPoint(x, y)
        );
		this.speed = vSpeed;
        this.location.position(vPos.add(vSpeed));
	}
};