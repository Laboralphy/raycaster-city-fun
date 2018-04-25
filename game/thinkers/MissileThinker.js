const MoverThinker = require('../../framework/engine/thinkers/MoverThinker');
const RC = require('../../framework/consts/raycaster');

/**
 * Gestion du déplacement des missile
 */
class MissileThinker extends MoverThinker {
	$move() {
		super.$move();
		// choc avec un mur
		let mobile = this.mobile();
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