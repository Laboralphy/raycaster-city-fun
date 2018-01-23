/**
 * Une localisation
 */

const o876 = require('../../o876');

module.exports = class Location extends o876.geometry.Vector {
	constructor(x = 0, y = 0, angle = 0, area = null) {
		super(x, y);
		this._heading = angle;
		this._area = area;
	}

	area(a) {
        return o876.SpellBook.prop(this, 'area', a);
	}

    /**
	 * Défini un nouvel angle
     * @param a {number}
     */
	heading(a) {
		return o876.SpellBook.prop(this, '_heading', a);
	}
};