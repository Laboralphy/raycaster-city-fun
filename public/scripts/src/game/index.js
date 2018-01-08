import LEVEL_CITY from './levels/city.lvl.js';

class Game extends O876_Raycaster.GameAbstract {
	init() {
		this.on('leveldata', function(wd) {
			console.log(LEVEL_CITY);
			wd.data = LEVEL_CITY;
		});
	}
}

export default Game;