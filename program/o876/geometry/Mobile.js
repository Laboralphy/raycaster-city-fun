/**
 * @class Mobile
 * This class manages a mobile object.
 */
const sb = require('../SpellBook');
const Vector2D = require('./Vector2D');

module.exports = class Mobile {
	constructor() {
		this.position = new Vector2D();
        this._shape = null;
		this._dead = false; // les mobile noté "dead" doivent être retiré du jeu
		this._collider = null;
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
	 * Renvoie la shape enrichie de la position actuelle du mobile
     * @return {Shape}
     */
    shapeShifted() {
    	let s = this._shape;
    	s.position = this.position;
    	return s;
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