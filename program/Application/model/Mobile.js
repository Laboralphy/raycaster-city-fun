/**
 * Gestion d'une entité mobile dans le labyrinthe
 * Collision
 * Décision
 */

const o876 = require('../../o876');
const Vector2D = o876.geometry.Vector2D;
const RC_CONST = require('../consts/raycaster');

module.exports = class Mobile {
	constructor() {
		// position & angle
		this.location = new o876.geometry.Location();
		// vitesse
		this.speed = new o876.geometry.Vector2D(0, 0);
		this.size = 16;
		this.wallCollisions = Vector2D.zero();
	}

	setSize(n) {
		this.size = n;
	}

	/**
	 * Détermine la collision entre le mobile et les murs du labyrinthe
	 * @typedef {Object} xy
	 * @property {number} x
	 * @property {number} y
	 *
	 * @param vPos {xy} position du mobile. ATTENTION ce vecteur est mis à jour par la fonction !
	 * @param vSpeed {xy} delta de déplacement du mobile. ATTENTION ce vecteur est mis à jour par la fonction !
	 * @param nSize {number} demi-taille du mobile
	 * @param nPlaneSpacing {number} taille de la grille
	 * (pour savoir ou est ce qu'on s'est collisionné). ATTENTION ce vecteur est mis à jour par la fonction !
	 * @param bCrashWall {boolean} si true alors il n'y a pas de correction de glissement
	 * @param pSolidFunction {function} fonction permettant de déterminer si un point est dans une zone collisionnable
	 */
	static computeWallCollisions(vPos, vSpeed, nSize, nPlaneSpacing, bCrashWall, pSolidFunction) {
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
			// xci et yci valent entre -1 et 1 et correspondent aux coeficient de direction
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
			pos: new Vector2D(x, y),
			speed: new Vector2D(dx, dy),
			wcf: oWallCollision
		};
	}

	/**
	 * Déplace le mobile selon le vector spécifié
	 * Gestion des collisions
	 * @param {o876.geometry.Vector2D} vSpeed
	 */
	move(vSpeed) {
		let oLocation = this.location;
        let vPos = new Vector2D(oLocation);
        let area = oLocation.area;
        this.computeWallCollisions(
            vPos,
            vSpeed,
            this.size,
            RC_CONST.rc_plane_spacing,
            this.wallCollisions,
            false,
            (x, y) => area.isSolidPoint(x, y)
        );
        this.location.setCoordinates(vPos.add(vSpeed));
	}
};