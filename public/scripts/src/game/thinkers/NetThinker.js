import AbstractThinker from './AbstractThinker';
import o876 from '../../../../../program/o876';

const ANIMATION_STAND = 0;
const ANIMATION_WALK = 1;
const ANIMATION_ACTION = 2;
const ANIMATION_DEATH = 3;
/**
 * Ce thinker permet de bouger un mobile en définissant un vecteur de vitesse.
 * Il ne dispose d'aucune intelligence artificielle Ce thinker a été conçu pour
 * être utilisé comme Thinker de base dans un environnement réseau. Le thinker
 * propose les fonction suivantes : - setSpeed(x, y) : définiiton de la vitesse
 * du mobile selon les axes X et Y - die() : le mobile passe à l'état DEAD (en
 * jouant l'animation correspondante - disable() : le mobile disparait -
 * restore() : le mobile réapparait dans la surface de jeux
 */
class NetThinker extends AbstractThinker {

	constructor() {
		super();
		this.fma = 0; // Moving angle
		this.fms = 0; // Moving Speed
		this.nDeadTime = 0;
	}


	setMovement(a, x, y, sx, sy) {
		this.mobile().setXY(x, y);
		let s =
			sy === undefined ?
				sx :
				Math.sqrt(sx * sx + sy * sy);
		let mobile = this.mobile();
		if (this.fma !== a || this.fms !== s) {
			this.fma = a;
			this.fms = s;
			let oSprite = mobile.oSprite;
			let nAnim = oSprite.nAnimationType;
			let bStopped = s === 0;
			switch (nAnim) {
				case ANIMATION_ACTION:
				case ANIMATION_STAND:
					if (!bStopped) {
						oSprite.playAnimationType(ANIMATION_WALK);
					}
					break;

				case ANIMATION_WALK:
					if (bStopped) {
						oSprite.playAnimationType(ANIMATION_STAND);
					}
					break;
			}
		}
	}

	disable() {
		this.state('disable');
	}

	restore() {
		this.mobile().bEthereal = false;
		this.state('alive');
	}

	$alive() {
		let m = this.mobile();
		m.move(this.fma,this.fms);
		if (this.game().oRaycaster.clip(m.x, m.y, 1)) {
			m.rollbackXY();
		}
	}

	$disable() {
		this.state('dead');
	}

	$dying_enter() {
		let m = this.mobile();
		this.setMovement(this.fma, m.x, m.y, 0);
		m.oSprite.playAnimationType(ANIMATION_DEATH);
		let nDeadTime = m.oSprite.oAnimation.nDuration * m.oSprite.oAnimation.nCount / this.game().TIME_FACTOR | 0;
		this.duration(nDeadTime).next('dead');
		this.mobile().bEthereal = true;
	}

	$dying() {
	}

	$dead_enter() {
		this.mobile().bEthereal = true;
		this.mobile().gotoLimbo();
		this.mobile().bActive = false;
	}

	$dead() {
		// quand c'est mort, c'est mort pour de bon
	}
}
