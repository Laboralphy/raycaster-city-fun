/**
 * Thinker du personnage controlé par le joueur
 */
import FPSThinker from './FPSThinker';

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
}


export default PlayerThinker;