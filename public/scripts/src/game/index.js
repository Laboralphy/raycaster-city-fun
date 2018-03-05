import Thinkers from './thinkers';
import ClientPrediction from './ClientPrediction';
import PingMonitor from "./PingMonitor";
import o876 from '../../../../program/o876';

class Game extends O876_Raycaster.GameAbstract {

	constructor(config) {
		super(config);
		this.__construct(config);
		this._mobiles = {};
		this._clientPrediction = new ClientPrediction();
		this._pingMonitor = null;
		this._localId = '';
		this.setupPingMonitor();
		this.setupListeners();
	}

	/**
	 * Initialisation du moniteur de ping
	 */
	setupPingMonitor() {
		let config = this.getConfig();
		this._pingMonitor = ('ping' in config.game && config.game.ping) ? new PingMonitor(config.game.ping) : null;
	}

	/**
	 * Initialisation des écouteurs
	 */
	setupListeners() {
		this.on('key.down', event => this.gameEventKey(event));
		this.on('enter', event => this.gameEventEnter(event));
		this.on('load', event => this.gameEventLoad(event));
		this.on('doomloop', event => this.gameEventDoomLoop(event));
		this.on('frame', event => this.gameEventFrame(event));
	}


	/**
	 * Ordonne le chargement d'un niveau par initialisation du Raycaster
	 * @param data {*} donnée du niveau
	 */
	loadLevel(data) {
		this.initRaycaster(data);
    }


	/**
	 * Renvoi l'instance du joueur local
	 * @return O876_Raycaster.Mobile
	 */
	getPlayer() {
		return this.oRaycaster.oCamera;
	}

	localId(id) {
		return o876.SpellBook.prop(this, '_localId', id);
	}






 // ######  #    #  ######  #    #   #####   ####
 // #       #    #  #       ##   #     #    #
 // #####   #    #  #####   # #  #     #     ####
 // #       #    #  #       #  # #     #         #
 // #        #  #   #       #   ##     #    #    #
 // ######    ##    ######  #    #     #     ####

	// Liste des écouteurs d'évènements

	/**
	 * A chaque frame : afficher le moniteur de ping
	 * @param oEvent
	 */
	gameEventFrame(oEvent) {
		this.renderPing();
	}

	/**
	 * Chargement du niveau et des resource
	 * Il s'agit principalement d'afficher la barre de progression
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


	/**
	 * Le joueur entre dans un nouveau niveau.
	 * Réglage du thinker
	 * @param oEvent
	 */
	gameEventEnter(oEvent) {
		// player thinker configuration
		let player = this.getPlayer();
		let ct = new Thinkers.Player();
		player.setThinker(ct.game(this).mobile(player));
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
	 * Chaque recalcul de l'état du raycaster entraine l'activation decet évènement
	 * @param oEvent
	 */
    gameEventDoomLoop(oEvent) {
    	// procede au calcul des positions des mobiles
		let aDeadMobiles = [];
		let mobs = this._mobiles;
		for (let i in mobs) {
			let mob = mobs[i];
			mob.think();
			if (mob.bActive) {
				aDeadMobiles.push(i);
			}
		}
		aDeadMobiles.forEach(i => delete mobs[i]);
	}







 // #####      #     ####   #####   #         ##     #   #
 // #    #     #    #       #    #  #        #  #     # #
 // #    #     #     ####   #    #  #       #    #     #
 // #    #     #         #  #####   #       ######     #
 // #    #     #    #    #  #       #       #    #     #
 // #####      #     ####   #       ######  #    #     #


	/**
	 * Affichage du moniteur de ping
	 */
	renderPing() {
		let pm = this._pingMonitor;
		if (pm) {
			let cvs = this.oRaycaster.getRenderCanvas();
			let pmc = pm._canvas;
			this
				.oRaycaster
				.getRenderContext()
				.drawImage(
					pm.render(),
					cvs.width - 4 - pmc.width,
					cvs.height - 4 - pmc.height
				);
		}
	}

	/**
	 * Enregistre un ping en vue de l'afficher
	 * @param t
	 */
	ping(t) {
		if (this._pingMonitor) {
			this._pingMonitor.sample(t);
		}
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





 // #    #   ####   #####           #          #    ######  ######
 // ##  ##  #    #  #    #          #          #    #       #
 // # ## #  #    #  #####           #          #    #####   #####
 // #    #  #    #  #    #          #          #    #       #
 // #    #  #    #  #    #          #          #    #       #
 // #    #   ####   #####           ######     #    #       ######


	// methodes de gestion des mobiles en réponse aux messages serveur
	// methodes de transmission des action utilisateur au serveur

	/**
	 * Le serveur a ordonné une correction de position du mobile
	 */
	applyMobileCorrection({a, x, y, sx, sy, id}) {
		// retrouver le packet id
		if (x === 0 || y === 0) throw new Error('Nope !');
		let mob = this.getPlayer();
		let cp = this._clientPrediction;
		let packets = cp.getPacketsAfter(id);
		cp.flush(id);
		mob.fTheta = a;
		mob.setXY(x, y);
		if (packets.length) {
			packets.forEach(({t, a, x, y, sx, sy, id, c}) => {
				for (let i = 0; i < t; ++i) {
					mob.fTheta = a;
					mob.slide(sx, sy);
				}
			});
		}
	}

	/**
	 * Transmet au serveur les information de déplacement du mobile controlé par le joueur
	 * Mise en tampon
	 * La transmission se fait par évènement
	 * @param a {number} angle visé par le mobile (direction dans laquelle il "regarde")
	 * @param x {number} position x du mobile
	 * @param y {number} position y du mobile
	 * @param sx {number} angle adopté par le mouvement du mobile
	 * @param sy {number} vitesse déduite du mobile (avec ajustement collision murale etc...)
	 * @param c {number} commandes
	 */
	netUpdatePlayerMobile(a, x, y, sx, sy, c) {
		let packet = {a, x, y, sx, sy, c};
		let cp = this._clientPrediction;
		let sendPacket = cp.pushMovement(packet);
		if (sendPacket) {
			this.trigger('update.player', sendPacket);
		}
	}


	/**
	 * Creation d'un mobile, suite à un ordre du serveur
	 * Ne pas créer de mobile qui a le même id que le player
	 * @param id {string} identifiant
	 * @param x {number} position
	 * @param y {number}
	 * @param s {number} vitesse
	 * @param a {number} angle
	 * @param bp {string} blueprints
	 */
	netSpawnMobile({id, a, x, y, sx, sy, bp}) {
		if (id !== this.localId()) {
			let m = this.spawnMobile(bp, x, y, a);
			let thinker = new Thinkers.Net();
			m.setThinker(thinker.game(this).mobile(m));
			m.getThinker().setMovement(a, x, y, sx, sy);
			this._mobiles[id] = m;
		}
	}

	/**
	 * Mise à jour de mobile, suite à un ordre du serveur
	 * @param id {string} identifiant
	 * @param x {number} position
	 * @param y {number}
	 * @param s {number} vitesse
	 * @param a {number} angle
	 */
	netUpdateMobile({id = null, a = null, x = null, y = null, sx = null, sy = null}) {
		if (id === this.localId()) {
			return;
		}
		if (id in this._mobiles) {
			this._mobiles[id].getThinker().setMovement(a, x, y, sx, sy);
		}
	}

	/**
	 * destruction de mobile, suite à un ordre du serveur
	 * @param id {string} identifiant
	 */
	netDestroyMobile({id}) {
		this._mobiles[id].getThinker().die();
	}
}

export default Game;