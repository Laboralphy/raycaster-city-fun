/**
 * Thinker du personnage controlé par le joueur
 */
import FPSThinker from './FPSThinker';
import * as COMMANDS from '../../../../../program/consts/commands'

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
		let c = 0;
		let mob = this.mobile();
		let f = mob.fTheta;
		let x = mob.x;
		let y = mob.y;
		this._aCurrentEvents.forEach(e => {
			switch (e) {
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
					c |= COMMANDS.MOUSE_LEFT;
					break;

				case 'u.d':
					c |= COMMANDS.ACTIVATE;
					break;
			}
		});
		let sx = mob.x - x;
		let sy = mob.y - y;
		this._game.netUpdatePlayerMobile(f, x, y, sx, sy, c);
	}
}

export default PlayerThinker;