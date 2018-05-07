/**
 * Permet de gerer un ensemble de force appliquée à un mobile
 */

class ForceField {
    constructor() {
        this._forces = [];
    }

    /**
     * ajoute une force
     * @param v {Vector} vecteur de force
     * @param f {number} facteur d'atténuation
     */
    force(v, f) {
        this._forces.push([v, f]);
    }

    /**
     * Somme de toutes les forces agissant sur le système
     * @return Vector
     */
    forces() {
        return this._forces.reduce((prev, f) => prev.add(f[0]), Vector.zero());
    }

    /**
     * Réduit l'effet des forces appliquée au mobiles
     */
    reduceForces() {
        this._forces = this._forces.filter(v => v[0].scale(v[1]).normalize() < 0.01);
    }
}