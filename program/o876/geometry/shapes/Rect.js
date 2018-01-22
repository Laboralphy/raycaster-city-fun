const Shape = require('./Shape');
const Vector = require('../../geometry/Vector2D');
/**
 * @class Fairy.Rect
 * @extends Fairy.Shape
 */


module.exports = class Rect extends Shape {
    constructor(v1, v2) {
        super();
        if (v1 !== undefined && v2 !== undefined) {
            // trier les composantes
            this._p1 = new Vector(Math.min(v1.x, v2.x), Math.min(v1.y, v2.y));
            this._p2 = new Vector(Math.max(v1.x, v2.x), Math.max(v1.y, v2.y));
        } else {
            throw new Error('Rect needs two vectors');
        }
    }

    points() {
        let p1 = this._p1;
        let p2 = this._p2;
        let p = this._position;
        return [
            p.add(p1),
            p.add(p2)
        ];
    }
};
