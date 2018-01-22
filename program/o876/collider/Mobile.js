/**
 * @class Mobile
 * This class manages a mobile object.
 */
const sb = require('../SpellBook');
const Vector2D = require('../geometry/Vector2D');

module.exports = class Mobile {
	constructor() {
		this._position = new Vector2D();
		this._dead = false; // les mobile noté "dead" doivent être retiré du jeu
		this._collider = null;
		this._radius = 0;
	}

    /**
	 * Setter/getter du rayon du mobile
     * @param r
     * @returns {*}
     */
	radius(r) {
        return sb.prop(this, '_radius', r);
	}

    /**
	 * Setter/Getter de la position du mobile
     * @param p
     * @returns {*}
     */
	position(p) {
        return sb.prop(this, '_position', p);
	}

    /**
     * Setter/Getter of dead flag...
     * dead Mobile must be removed from game
     * @param b {boolean}
     * @return {boolean|Mobile}
     */
    dead(b) {
        return sb.prop(this, '_dead', b);
    }


    /**
	 * Setter/Getter of an instance of Collider
     * @param c {Collider}
     * @return {Collider|Mobile}
     */
    collider(c) {
        return sb.prop(this, '_collider', c);
	}

    /**
	 * Processes time; animation, flight, and collisions will be processed.
     * @param nTime {number} the time advances
     */
	process(nTime) {
		if (this._collider) {
			this._collider.track(this);
		}
	}

    /**
	 * Calcule la distance entre le mobile et un autre mobile
     * @param oOther {Mobile}
     * @returns {*|float|number}
     */
	distanceTo(oOther) {
        return this.position().point().distance(oOther.position().point());
	}

    /**
	 * Renvoi l'angle entre les deux mobile (this et oOther) et l'axe X
     * @param oOther
     * @returns {number}
     */
	angleTo(oOther) {

		return 0;
	}

    /**
	 * renvoie true si les deux mobile se collisionne.
     * @param oOther {Mobile}
     * @returns {boolean}
     */
	hits(oOther) {
		return this.distanceTo(oOther) < this._radius + oOther.radius();
	}
};