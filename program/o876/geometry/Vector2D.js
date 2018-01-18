/**
 * Created by ralphy on 04/09/17.
 *
 * @class Vector2D
 * @property {number} x
 * @property {number} y
 */

const Point = require('./Point.js');
const Helper = require('./Helper.js');

module.exports = class Vector2D {
	/**
	 * The constructor accepts one two parameters
	 * If one parameter is given, the constructor will consider it as
	 * Vector or Point and will build this vector accordingly.
	 * If two parameters are given (both numbers), the constructor will initialize the x and y
	 * components with these numbers.
	 * if no parameters are given : the vector will be ZERO
	 * @param (x) {Vector2D|Point|number}
	 * @param (y) {number}
	 */
	constructor(x, y) {
		if ((x instanceof Vector2D) || (x instanceof Point)) {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x || 0;
			this.y = y || 0;
		}
	}

	/**
	 * Immutable !
	 * returns a new Vector which is the sum of this instance + the given argument
	 * @param v {Vector2D|Point}
	 * @returns {Vector2D}
	 */
	add(v) {
		return new Vector2D(v.x + this.x, v.y + this.y);
	}

	/**
	 * Immutable !
	 * returns a new Vector which is the diffrence of this instance and the given argument
	 * @param v
	 */
	sub(v) {
		return new Vector2D(this.x - v.x, this.y - v.y);
	}

	/**
	 * Immutable !
	 * returns a scalar product
	 * multiplies the vector components by a given value -(vector, point or number)
	 * @param f {Vector2D|number}
	 * @returns {Vector2D|number}
	 */
	mul(f) {
		if ((f instanceof Vector2D) || (f instanceof Point)) {
			return this.x * f.x + this.y * f.y;
		} else if (typeof f === 'number') {
			return new Vector2D(this.x * f, this.y * f);S
		} else {
			throw new Error('vector product accepts only vectors or number as parameter');
		}
	}

	/**
	 * return the vector distance
	 * @return {number}
	 */
	distance() {
		return Helper.distance(0, 0, this.x, this.y);
	}

	/**
	 * returns a normalized version of this vector
	 * @return {Vector2D}
	 */
	normalize() {
		return this.mul(1 / this.distance());
	}

	/**
	 * returns a zero vector
	 * @returns {Vector2D}
	 */
	static zero() {
		return new Vector2D(0, 0);
	}
};