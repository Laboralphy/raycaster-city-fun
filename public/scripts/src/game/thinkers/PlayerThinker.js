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

	/**
	 * Lorsque le serveur impose une position différente de celle du client, on créé un vecteur différentiel qui
	 * s'estompe à chaque frame afin de ne pas créer de correction trop violente ce qui amenrai à des mouvement saccadé à l'écran
	 * @param x
	 * @param y
	 */
	applyCorrectionOffset(x, y) {
		let m = this._mobile;
		m.xOfs = (this.x + m.xOfs) - x;
		m.xOfs = (this.y + m.yOfs) - y;
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

		mob.xOfs = Math.abs(mob.xOfs) < 0.1 ? 0 : mob.xOfs / 2;
		mob.yOfs = Math.abs(mob.yOfs) < 0.1 ? 0 : mob.yOfs / 2;

		this._game.netUpdatePlayerMobile(f, x, y, sx, sy, c);
	}
}

export default PlayerThinker;