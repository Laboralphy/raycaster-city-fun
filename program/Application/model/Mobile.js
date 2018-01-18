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
     *
     * @param vPos {Vector2D} position du mobile. ATTENTION ce vecteur est mis à jour par la fonction !
     * @param vSpeed {Vector2D} delta de déplacement du mobile. ATTENTION ce vecteur est mis à jour par la fonction !
     * @param nSize {number} demi-taille du mobile
     * @param nPlaneSpacing {number} taille de la grille
     * @param oWallCollision {Vector2D} indicateurs de collision après calculs
     * (pour savoir ou est ce qu'on s'est collisionné). ATTENTION ce vecteur est mis à jour par la fonction !
     * @param bCrashWall {boolean} si true alors il n'y a pas de correction de glissement
     * @param pSolidFunction {function} fonction permettant de déterminer si un point est dans une zone collisionnable
     */
    static computeWallCollisions(vPos, vSpeed, nSize, nPlaneSpacing, oWallCollision, bCrashWall, pSolidFunction) {
        let dx = vSpeed.x;
        let dy = vSpeed.y;
        let x = vPos.x;
        let y = vPos.y;
        // une formule magique permettant d'igorer l'oeil "à la traine", evitant de se faire coincer dans les portes
        let iIgnoredEye = (Math.abs(dx) > Math.abs(dy) ? 1 : 0) | ((dx > dy) || (dx === dy && dx < 0) ? 2 : 0);
        let xClip, yClip, ix, iy, xci, yci;
        let bCorrection = false;
        // par defaut pas de colision détectée
        oWallCollision.x = 0;
        oWallCollision.y = 0;
        // pour chaque direction...
        for (let i = 0; i < 4; ++i) {
        	// si la direction correspond à l'oeil à la traine...
            if (iIgnoredEye === i) {
            	// ... on passe
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
                vSpeed.x = 0;
                if (bCrashWall) {
                    vSpeed.y = 0;
                }
                oWallCollision.x = xci;
                bCorrection = true;
            }
            if (yClip) {
                vSpeed.y = 0;
                if (bCrashWall) {
                    vSpeed.x = 0;
                }
                oWallCollision.y = yci;
                bCorrection = true;
            }
        }
        if (bCorrection) {
        	// il y a eu collsion
			// corriger la coordonée impactée
            if (oWallCollision.x > 0) {
                vPos.x = (x / nPlaneSpacing | 0) * nPlaneSpacing + nPlaneSpacing - 1 - nSize;
            } else if (oWallCollision.x < 0) {
                vPos.x = (x / nPlaneSpacing | 0) * nPlaneSpacing + nSize;
            }
            if (oWallCollision.y > 0) {
                vPos.y = (y / nPlaneSpacing | 0) * nPlaneSpacing + nPlaneSpacing - 1 - nSize;
            } else if (oWallCollision.y < 0) {
                vPos.y = (y / nPlaneSpacing | 0) * nPlaneSpacing + nSize;
            }
        }
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