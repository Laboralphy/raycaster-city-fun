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
		this._speed = new Vector(); // véritable vitesse qui controle le déplacement du mobile
		this._angle = 0;
		this._bHasChangedMovement = true;
		this.state('move');
	}

	$move() {
		let m = this._mobile;
		m.inertia().set(0, 0);
		m.location.heading(this._angle);
		m.move(this._speed);
	}

	/**
	 * Renvoie true si le mobile à modifié son mouvement
	 *  = si sa vitesse aux axes, ou son angle de cap ont changé de valeur
	 */
	hasChangedMovement() {
		let b = this._bHasChangedMovement;
		this._bHasChangedMovement = false;
		return b;
	}

	getMovement() {
		let m = this._mobile;
		let loc = m.location;
		let pos = loc.position();
		let spd = m.inertia();
		return {
			id: m.id,
			a: loc.heading(),
			x: pos.x,
			y: pos.y,
			sx: spd.x,
			sy: spd.y
		};
	}

	setMovement({a, sx, sy}) {
		if (a !== this._angle) {
			this._bHasChangedMovement = true;
			this._angle = a;
		}
		if (sx !== this._speed.x || sy !== this._speed.y) {
			this._bHasChangedMovement = true;
			this._speed.set(sx, sy);
		}
	}
};