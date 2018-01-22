const Shape = require('./Shape');
const Vector = require('../../geometry/Vector2D');
const Point = require('../../geometry/Point');
/**
 * @class Fairy.Rect
 * @extends Fairy.Shape
 */


module.exports = class Circle extends Shape {
	constructor(vCenter, radius) {
		super();
		if (vCenter !== undefined && radius !== undefined) {
			// trier les composantes
			this._center = vCenter;
			this._radius = radius;
		} else {
			throw new Error('Circle needs a vector and a number');
		}
	}

	center() {
		return this.position().add(this._center);
	}

	radius()

	hits(oShape) {
		let pMe = new Point(this._center.x, this._center.y);
		let pOther = new Point(oShape._center.x, oShape._center.y);
		let d = pMe.distance(pOther);
		return d < this._radius + oShape._radius;
	}
};

