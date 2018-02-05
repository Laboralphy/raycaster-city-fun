import LEVEL_CITY from './levels/city.lvl.js';

class Game extends O876_Raycaster.GameAbstract {
	init() {
		this.on('leveldata', function(wd) {
			wd.data = LEVEL_CITY;
		});
		this.on('key.down', event => this.gameEventKey(event));
		this.on('enter', event => this.gameEventEnter(event));
		MAIN.pointerlock.on('exit', event => this.gameEventExitPointerLock(event));
	}



	gameEventEnter(oEvent) {

	}


    /**
     * Event triggered when a key is pressed
     * @param oEvent {k : pressed key code }
     */
    gameEventKey(oEvent) {
        switch (oEvent.k) {
			case KEYS.ENTER:
				break;

			case KEYS.ESCAPE:
				this.showOverlay();
				break;
        }
    }

    gameEventExitPointerLock(oEvent) {
		this.showOverlay();
		this.trigger('blur'); // perte de pointerlock
	}




	/**
	 * Renvoi l'instance du joueur local
	 * @return O876_Raycaster.Mobile
	 */
	getPlayer() {
    	return this.oRaycaster.oCamera;
	}

	/**
	 * Affichage d'un overlay
	 * Freeze les contrôles du joueur
	 */
	showOverlay() {
		MAIN.screen.style.opacity = 0.5;
		this.getPlayer().getThinker().freeze();
	}

	/**
	 * Supprime l'overlay
	 * Réactive les contrôles du joueur
	 */
	hideOverlay() {
		MAIN.screen.style.opacity = 1;
		this.getPlayer().getThinker().thaw();
	}

}

export default Game;