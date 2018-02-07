class Game {

	constructor(config) {
		this._raycaster = null;
		this._game = new O876_Raycaster.GameAbstract();
		this._game.setConfig(config);
		this.init();
	}

	raycaster() {
		return this._raycaster;
	}

	/**
	 * Chargement d'un niveau
	 * @param data {*} donnée du niveau
	 */
	loadLevel(data) {
		this._nextLevel = data;
	}


	init() {
		//console.log('start of init');
		this._nextLevel = null;
		this._game.on('leveldata', this.gameEventRequestLevel.bind(this));
		this._game.on('key.down', event => this.gameEventKey(event));
		this._game.on('enter', event => this.gameEventEnter(event));
		this._game.on('load', event => this.gameEventLoad(event));
		this._game.on('raycaster', event => this._raycaster = event.raycaster);
	}

	/**
	 * Lorsqu'un niveau doit être chargé , cet évènement est lancé
	 * @param wd
	 */
	gameEventRequestLevel(wd) {
		console.log('requesting level', this._nextLevel);
		wd.data = this._nextLevel;
	}

	/**
	 * Chargement du niveau
	 * @param oEvent
	 */
	gameEventLoad(oEvent) {
		let s = oEvent.phase;
		let n = oEvent.progress;
		let nMax = oEvent.max;
		let oCanvas = this._game.oRaycaster.getScreenCanvas();
		let oContext = this._game.oRaycaster.getScreenContext();
		oContext.clearRect(0, 0, oCanvas.width, oCanvas.height);
		let sMsg = s;
		let y = oCanvas.height >> 1;
		let nPad = 96;
		let xMax = oCanvas.width - (nPad << 1);
		oContext.font = '10px monospace';
		oContext.fillStyle = 'white';
		oContext.fillText(sMsg, nPad, oCanvas.height >> 1);
		oContext.fillStyle = 'rgb(48, 24, 0)';
		oContext.fillRect(nPad, y + 12, xMax, 8);
		oContext.fillStyle = 'rgb(255, 128, 48)';
		oContext.fillRect(nPad, y + 12, n * xMax / nMax, 8);
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




	/**
	 * Renvoi l'instance du joueur local
	 * @return O876_Raycaster.Mobile
	 */
	getPlayer() {
    	return this._game.oRaycaster.oCamera;
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