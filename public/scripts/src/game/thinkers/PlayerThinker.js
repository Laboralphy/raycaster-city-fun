/**
 * Thinker du personnage controlé par le joueur
 */
import FPSThinker from './FPSThinker';
import * as COMMANDS from '../../../../../program/Application/consts/commands'

class PlayerThinker extends FPSThinker {

	constructor() {
		super();
		this.defineKeys({
			df : ['z', 'w'],
			db : 's',
			dl : ['q', 'a'],
			dr : 'd',
			cu : ' '
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

	$active() {
		super.$active();
		let n = 0;
		let mob = this.mobile();
		this._aCurrentEvents.forEach(c => {
			switch (c) {
				case 'df.c':
					mob.moveForward();
					break;

				case 'dl.c':
					mob.strafeLeft();
					break;

				case 'dr.c':
					mob.strafeRight();
					break;

				case 'db.c':
					mob.moveBackward();
					break;

				case 'b0.d':
					n |= COMMANDS.MOUSE_LEFT;
					break;

				case 'u.d':
					n |= COMMANDS.ACTIVATE;
					break;
			}
		});
		let f = mob.fTheta;
		let x = mob.x;
		let y = mob.y;
		let sx = mob.xSpeed;
		let sy = mob.ySpeed;
		this._game.updatePlayerMobile(f, x, y, sx, sy, n);
	}
}

export default PlayerThinker;