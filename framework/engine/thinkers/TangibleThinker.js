const MoverThinker = require('./MoverThinker');
const RC = require('../../consts/raycaster');
const o876 = require('../../o876');

const Vector = o876.geometry.Vector;

/**
 * Cette classe gère l'IA d'un mob tangible (qui est soumis aux collision de missile)
 */
class TangibleThinker extends MoverThinker {
    $move() {
        super.$move();
        let m = this.mobile();
        m.computeMobileCollisions();
        m.applyForces();
    }
}

module.exports = TangibleThinker;