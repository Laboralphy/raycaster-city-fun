/**
 * Une localisation
 */

const o876 = require('../../o876');

module.exports = class Location extends o876.geometry.Vector2D {
	constructor(x = 0, y = 0, angle = 0, area = null) {
		super(x, y);
		this.angle = angle;
		this.area = area;
	}

    /**
	 * Défini les coordonnées
     * @param v {o876.geometry.Vector2D)
     */
	setCoordinates(v) {
		this.x = v.x;
		this.y = v.y;
		return this;
	}

    /**
	 * Défini un nouvel angle
     * @param a {number}
     */
	setAngle(a) {
		this.angle = a;
		return this;
	}
};