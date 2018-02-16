import PlayerThinker from './thinkers/PlayerThinker';
import ClientPrediction from './ClientPrediction';

class Game extends O876_Raycaster.GameAbstract {

	constructor(config) {
		super(config);
		this.__construct(config);
		this._clientPrediction = new ClientPrediction();
		this._mobiles = {};
		this.init();
	}

	/**
	 * Chargement d'un niveau
	 * @param data {*} donnée du niveau
	 */
	loadLevel(data) {
		this.initRaycaster(data);
    }


	init() {
		this.on('key.down', event => this.gameEventKey(event));
		this.on('enter', event => this.gameEventEnter(event));
		this.on('load', event => this.gameEventLoad(event));
	}

	/**
	 * Chargement du niveau
	 * @param oEvent
	 */
	gameEventLoad(oEvent) {
		let s = oEvent.phase;
		let n = oEvent.progress;
		let nMax = oEvent.max;
		let oCanvas = this.oRaycaster.getScreenCanvas();
		let oContext = this.oRaycaster.getScreenContext();
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
		// player thinker configuration
		let player = this.oRaycaster.oCamera;
		let ct = new PlayerThinker();
		this.oRaycaster.oCamera.setThinker(ct.game(this).mobile(player));
        ct.on('use.down', () => this.activateWall(player));
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
	 * Transmet au serveur les information de déplacement du mobile controlé par le joueur
	 * Mise en tampon
	 * @param a {number} angle visé par le mobile (direction dans laquelle il "regarde")
	 * @param x {number} position x du mobile
	 * @param y {number} position y du mobile
	 * @param sx {number} angle adopté par le mouvement du mobile
	 * @param sy {number} vitesse déduite du mobile (avec ajustement collision murale etc...)
	 * @param c {number} commandes
	 */
	updatePlayerMobile(a, x, y, sx, sy, c) {
		let packet = {a, x, y, sx, sy, c};
		let cp = this._clientPrediction;
		if (cp.pushMovement(packet)) {
			this.trigger('update.player', cp.getUnsentPackets());
		}
	}


	/**
	 * Le serveur a ordonné une correction de position du mobile
	 */
	applyMobileCorrection({a, x, y, sx, sy, id}) {
		// retrouver le packet id
		let mob = this.getPlayer();
		let cp = this._clientPrediction;
		let packets = cp.getPacketsAfter(id);
		mob.fTheta = a;
		mob.setXY(x, y);
		cp.flush(id);
		if (packets.length) {
			packet.forEach(({t, a, x, y, sx, sy, id, c}) => {
				for (let i = 0; i < t; ++i) {
					mob.fTheta = a;
					mob.slide(sx, sy);
				}
			});
		}
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


	/**
	 * Creation d'un mobile
	 * @param id {string} identifiant
	 * @param x {number} position
	 * @param y {number}
	 * @param s {number} vitesse
	 * @param a {number} angle
	 * @param bp {string} blueprints
	 */
	mspawn({id, x, y, s, a, bp}) {
		console.log('spawn', id);
		let m = this.spawnMobile(bp, x, y, a);
		m.getThinker().setMovement(a, s);
		this._mobiles[id] = m;
	}

	/**
	 * Mise à jour de mobile
	 * @param id {string} identifiant
	 * @param x {number} position
	 * @param y {number}
	 * @param s {number} vitesse
	 * @param a {number} angle
	 */
	mupdate({id, x, y, s, a}) {
		this.getMobile();
		let m = this.spawnMobile(bp, x, y, a);
		let th = m.getThinker();
		th.setMovement(a, s);
	}

	/**
	 * destruction de mobile
	 * @param id {string} identifiant
	 */
	mdestroy({id}) {
		console.log('destroy', id);
		this._mobiles[id].getThinker().die();
	}
}

export default Game;