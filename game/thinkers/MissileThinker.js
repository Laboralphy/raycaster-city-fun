const MoverThinker = require('../../framework/engine/thinkers/MoverThinker');
const RC = require('../../framework/consts/raycaster');

/**
 * Gestion du déplacement des missile
 */
class MissileThinker extends MoverThinker {
	$move() {
		super.$move();
	}
}


module.exports = MissileThinker;