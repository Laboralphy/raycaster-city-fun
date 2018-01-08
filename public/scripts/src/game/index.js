import LEVEL_CITY from './levels/city.lvl.js';

class Game extends O876_Raycaster.GameAbstract {
	init() {
		this.on('leveldata', function(wd) {
			wd.data = LEVEL_CITY;
		});
        this.on('key.down', event => this.gameEventKey(event));
	}


    /**
     * Event triggered when a key is pressed
     * @param oEvent {k : pressed key code }
     */
    gameEventKey(oEvent) {
        switch (oEvent.k) {
            case KEYS.ALPHANUM.ENTER:

                break;
        }
    }
}

export default Game;