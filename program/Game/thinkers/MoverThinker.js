const Thinker = require('./Thinker');
const o876 = require('../../o876/index');
const Vector = o876.geometry.Vector;

module.exports = class  MoverThinker extends Thinker {
	constructor() {
		super();
		this._speed = new Vector();
		this._angle = 0;
		this._prevMovement = null;
		this.state('move');
	}

	$move() {
		let m = this._mobile;
		m.location.heading(this._angle);
		m.move(this._speed);
	}

	/**
	 * Renvoie true si le mobile à modifié son mouvement
	 */
	hasChangedMovement() {
		let m = this._mobile;
		let loc = m.location;
		let pos = loc.position();
		let spd = m.speed;
		let mov = {
			id: m.id,
			a: loc.heading(),
			x: pos.x,
			y: pos.y,
			sx: spd.x,
			sy: spd.y
		};
		let pmov = this._prevMovement;
		if (!pmov) {
			this._prevMovement = mov;
			return true;
		} else if (pmov.sx !== mov.sx || pmov.sy !== mov.sy || pmov.a !== mov.a) {
			this._prevMovement = mov;
			return true;
		} else {
			return false;
		}
	}

	getMovement() {
		return this._prevMovement;
	}

	setMovement({a, sx, sy}) {
		this._speed.set(sx, sy);
		this._angle = a;
	}
};