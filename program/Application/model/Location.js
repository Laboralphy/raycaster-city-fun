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
};