const Shape = require('./Shape');
const Vector = require('../Vector2D');
/**
 * @class Fairy.Rect
 * @extends Fairy.Shape
 */


module.exports = class Rect extends Shape {
    constructor() {
        super();
        this._p1 = new Vector();
        this._p2 = new Vector();
    }

    points() {
        let p1 = this._p1;
        let p2 = this._p2;
        let p = this.position;
        return [
            p.add(p1),
            p.add(p2)
        ];
    }


    static _getCollisionAxis(f, fMin, fMax) {
        if (f < fMin) {
            return 1;
        }
        if (f > fMax) {
            return 3;
        }
        return 2;
    }


    /**
     * Renvoie un code secteur correspondant au point spécifié
     * Permet de resoudre les collision
     * @param p vector
     */
    _getCollisionSector(v) {
        let p = this.points();
        let p1 = p[0];
        let p2 = p[1];
        let a = Rect._getCollisionAxis(v.x, p1.x, p2.x);
        let b = Rect._getCollisionAxis(v.y, p1.y, p2.y);
        /*
        1 2 3
        4 5 6
        7 8 9
        */
        switch ((a << 4) | b) {
            case 0x11: return 1;
            case 0x12: return 4;
            case 0x13: return 7;

            case 0x21: return 2;
            case 0x22: return 5;
            case 0x23: return 8;

            case 0x31: return 3;
            case 0x32: return 6;
            case 0x33: return 9;
        }
    }

    inside(v) {
        let p = this.points();
        return Rect.between(v.x, p[0].x, p[1].x) && this.between(v.y, p[0].y, p[1].y);
    }

    /**
     * Renvoie true si la forme superpose même partiellement l'autre forme spécifiée en param
     * @param oShape autre forme
     * @return boolean
     */
    hits(oShape) {
        /*
        1 2 3
        4 5 6
        7 8 9
        */
        if (!super.hits(oShape)) {
            return false;
        }
        let pIts = oShape.points();
        let s1 = this._getCollisionSector(pIts[0]);
        let s2 = this._getCollisionSector(pIts[1]);
        if (s2 < s1) {
            throw new Error('weird error : unexpected collision case ' + s2 + ' > ' + s1);
        }
        switch ((s1 << 4) | s2) {
            case 0x11:
            case 0x12:
            case 0x13:
            case 0x14:
            case 0x17:

            case 0x22:
            case 0x23:

            case 0x33:
            case 0x36:
            case 0x39:

            case 0x44:
            case 0x47:

            case 0x66:
            case 0x69:

            case 0x77:
            case 0x78:
            case 0x79:

            case 0x88:
            case 0x89:

            case 0x99:
                return false;

            default:
                return true;
        }
    }
};
