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

    /**
     * Renvoie TRUE si oShape percute this
     * @param {Shape} oShape
     * @return boolean
     */
    hits(oShape) {
        return (oShape.tangibility & this.tangibility) !== 0;
    }
};
