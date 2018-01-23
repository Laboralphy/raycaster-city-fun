/**
 * Une localisation
 */

const o876 = require('../../o876');

module.exports = class Location {
	constructor(x = 0, y = 0, angle = 0, area = null) {
		this._heading = angle;
		this._area = area;
		this._position = new o876.geometry.Vector(x, y);
	}

	position(p) {
		return o876.SpellBook.prop(this, '_position', p);
	}

	area(a) {
        return o876.SpellBook.prop(this, '_area', a);
	}

    /**
	 * Défini un nouvel angle
     * @param a {number}
     */
	heading(a) {
		return o876.SpellBook.prop(this, '_heading', a);
	}
};