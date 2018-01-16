/**
 * Created by ralphy on 04/09/17.
 */

const Helper = require('./Helper');

module.exports = class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	/**
	 * return the distance between this point and the given point
	 * @param p {Point}
	 * @return {number}
	 */
	distance(p) {
		return Helper.distance(p.x, p.y, this.x, this.y);
	}
};