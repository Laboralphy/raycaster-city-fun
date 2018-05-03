/**
 * Le Mover Thinker permet d'interpoler les movement des joueurs
 * Chaque joueur envoie des données de modif de mouvement de temps à autres
 * Ce Thinker permet à chaque frame de calculer la position exacte du mobile et
 * d'effectuer des calcul de collision avec les murs.
 */
const Thinker = require('./Thinker');
const o876 = require('../../o876/index');
const Vector = o876.geometry.Vector;

module.exports = class MoverThinker extends Thinker {
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
	 *  = si sa vitesse aux axes, ou son angle de cap ont changé de valeur
	 */
	hasChangedMovement() {
		let m = this._mobile;
		let loc = m.location;
		let pos = loc.position();
		let spd = m.speed;
		console.log(spd);
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