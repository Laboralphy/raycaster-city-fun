/**
 * @class Mobile
 * This class manages a mobile object.
 */
const sb = require('../SpellBook');
const Vector2D = require('../geometry/Vector2D');

module.exports = class Mobile {
	constructor() {
		this._position = new Vector2D();
        this._shape = null;
		this._dead = false; // les mobile noté "dead" doivent être retiré du jeu
		this._collider = null;
	}

	position(p) {
		this.shape().position(p);
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
     * Setter/Getter of shape...
     * @param s {Shape}
     * @return {Shape|Mobile}
     */
    shape(s) {
        return sb.prop(this, '_shape', s);
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
};