/**
 * Created by ralphy on 04/09/17.
 */

const Helper = require('./Helper');
const Vector2D = require('./Vector2D');

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

    /**
	 * Fabrique un vecteur à partir de deux points
	 * La base du vecteur est spécifée
     * @param pBase {point}
	 * @return {Vector2D}
     */
	vector(pBase) {
		if (pBase === undefined) {
			return new Vector2D(this.x, this.y);
		} else {
            return new Vector2D(this.x - p.x, this.y - p.y);
		}
	}
};