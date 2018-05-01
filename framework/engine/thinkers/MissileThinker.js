const MoverThinker = require('./MoverThinker');
const RC = require('../../consts/raycaster');
const o876 = require('../../o876');

const Vector = o876.geometry.Vector;

/**
 * Gestion du déplacement des missile
 */
class MissileThinker extends MoverThinker {
	constructor() {
		super();
		this.owner = null;
		this.subSpeed = 4; // vitesse de collisionnement (si le missile va trop vite, il pourrai manquer des collision)
	}

    /**
	 * Vérifie si on collisionne un mobile entre vFrom et vTo
     * @param vFrom
     * @param vTo
     */
	checkMobileCollisions() {
		this._mobile.computeMobileCollisions();
	}

	$move() {
		super.$move();
        this.checkMobileCollisions();
		// il va faloir déterminer si le missile à traversé un mobile.
		// choc avec un mur
		let mobile = this._mobile;
		if (mobile.hasHitWall()) {
			// il y a eu collision
			this.state('explode');
		}
	}

	$explode_enter() {
		this.mobile().die();
	}
}


module.exports = MissileThinker;