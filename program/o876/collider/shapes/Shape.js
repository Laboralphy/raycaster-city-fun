const Vector = require('../../geometry/Vector2D');
const sb = require('../../SpellBook');
/**
 * @class Fairy.Shape
 *
 * Cette classe est un abstract de forme. Contient quelque methode de calcule pour les collision entre formes.
 *
 */
module.exports = class Shape {
    constructor() {
        this._position = new Vector();
        this.tangibility = 1;
    }

    position(p) {
        return sb.prop(this, '_position', p);
    }


    // Pour savoir si l'objet A percute l'objet B on fait (A.nTangibilityMask &
    // B.nTangibilityMask) si le résultat
    // Si le resultat est différent de 0, les deux objet sont susceptible de
    // collision (si leurs shapes se recouvrent)

    /**
     * Renvoie true si x est entre x1 et x2
     * @param {number} x valeur à tester
     * @param {number} x1 borne inf
     * @param {number} x2 borne sup
     * @return {boolean}
     */
    static between(x, x1, x2) {
        if (x1 === x2) {
            return x === x1;
        } else if (x1 < x2) {
            return x >= x1 && x <= x2;
        } else {
            return x >= x2 && x <= x1;
        }
    }

    /**
     * Renvoie la distance au carré entre deux points
     * @param {Vector2D} v1
     * @param {Vector2D} v2
     * @return {number}
     */
    static squareDistance(v1, v2) {
        let x1 = v1.x;
        let y1 = v1.y;
        let x2 = v2.x;
        let y2 = v2.y;
        return ((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1));
    }

    /**
     * Renvoie la distance entre deux points, tsoin, tsoin
     * @param {Vector2D} v1
     * @param {Vector2D} v2
     * @return {number}
     */
    static distance(v1, v2) {
        return Math.sqrt(Shape.squareDistance(v1, v2));
    }

    /**
     * renvoie TRUE si v1 et v2 sont à une distance max de d
     * @param {Vector2D} v1
     * @param {Vector2D} v2
     * @return {boolean}
     */
    static nearer(v1, v2, d) {
        return (d * d) > Shape.squareDistance(v1, v2);
    }

    /**
     * Renvoie true si le point spécifé est dans la forme
     */
    static inside(v) {
        return false;
    }

    /**
     * Renvoie TRUE si oShape percute this
     * @param {Shape} oShape
     * @return boolean
     */
    hits(oShape) {
        return (oShape.tangibility & this.tangibility) !== 0;
    }
};
