/**
 * Thinker du personnage controlé par le joueur
 */
import FPSThinker from './FPSThinker';

const MAX_UPDATE_TIME = 500;

class PlayerThinker extends FPSThinker {
    constructor() {
        super();
        this.on('forward.command', () => {
            this._mobile.moveForward();
            this.checkCollision();
        });
        this.on('left.command', () => {
            this._mobile.strafeLeft();
            this.checkCollision();
        });
        this.on('right.command', () => {
            this._mobile.strafeRight();
            this.checkCollision();
        });
        this.on('backward.command', () => {
            this._mobile.moveBackward();
            this.checkCollision();
        });
    }


    checkCollision() {
        let m = this._mobile;
        if (m.oMobileCollision !== null) {
            let oTarget = m.oMobileCollision;
            if (oTarget.oSprite.oBlueprint.nType !== RC.OBJECT_TYPE_MISSILE) {
                m.rollbackXY();
            }
        }
    }


	/**
	 * Retransmet les mouvements au Game
	 * Pour qu'il les renvoie au serveur
     *
	 */
	transmitMovement() {
		let bUpdate = false; // si ce flag passe à true, on fait une mise à jour
        // la mise à jour consiste simplement à transmettre au serveur les coordonnées/vitesse/angle du mobile au serveur
		let m = this.oMobile;
		// angle de caméra
		let f = m.fTheta;
		// position
		let x = m.x;
		let y = m.y;
		// vitesse
		let fms = m.fMovingSpeed;
		let fma = m.fMovingAngle;
		let nLUT = this.oGame.getTime() - this.nLastUpdateTime;
		if (nLUT > MAX_UPDATE_TIME) {
		    // trop de temps sans mettre à jour :
            // forcer la mise à jour
			if (x !== this.xLast || y !== this.yLast) {
				this.xLast = x;
				this.yLast = y;
				bUpdate = true;
			}
		}
		if (bUpdate || this.fLastMovingSpeed !== fms || this.fLastMovingAngle !== fma || this.fLastTheta !== f) {
			this.fLastMovingSpeed = fms;
			this.fLastMovingAngle = fma;
			this.fLastTheta = f;
			bUpdate = true;
		}
		if (bUpdate) {
			this._game.updatePlayerMobile(f, x, y, fma, fms);
			this.nLastUpdateTime = this._game.getTime();
		}
	}
}


export default PlayerThinker;