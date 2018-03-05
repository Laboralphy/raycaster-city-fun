const ServiceAbstract = require('../ServiceManager/Abstract');
const logger = require('../Logger/index');
const RC = require('../consts/raycaster');
const STRINGS = require('../consts/strings');
const STATUS = require('../consts/status');
const Game = require('./System');

class ServiceGame extends ServiceAbstract {
    constructor() {
        super();
        let gs = new Game();
		this._gs = gs;

		// Le game system va parfois transmettre de l'information
		// ces info sont transférées au réseau
        gs.emitter.on('transmit', (id, event, data) => {
            logger.log('transmit', event, 'to', id);
            this._emit(id, event, data);
        });

        setInterval(() => this.doomloop(), RC.time_factor);
    }

    doomloop() {
		let aMutations = this._gs.getStateMutations();
		aMutations.mu.forEach(m => this._emit(m.players.map(p => p.id), 'G_UPDATE_MOBILE', {m: m.m}));
	}

    error(client, e) {
        let msg = e.toString();
        console.error(e.stack);
        logger.err(msg);
        this._emit(client.id, 'G_ERROR', {
            err: msg
        });
    }

	disconnectClient(client) {
    	super.disconnectClient(client);
    	// supprimer l'entité du client
		let id = client.id;
		this._gs.clientHasLeft(client);
	}

	/**
     * appelée automatiquement lorsqu'un client se connecte au service
	 * @param client
	 */
	connectClient(client) {
        super.connectClient(client);
        let socket = client.socket;

        /**
         * Le client indique qu' "il est prêt"
         * voir le détail de chaque phase
         */
        socket.on('G_READY', async ({phase}) => {
            // chargement d'un niveau
            try {
                let data;
                switch (phase) {
                    case STATUS.GAME_INITIALIZED: // le client est pret à recevoir les données d'un niveau
						data = await this._gs.clientWantsToLoadLevel(client);
						this._emit(client.id, 'G_LOAD_LEVEL', {
							level: data.area.data(),
							doors: data.doors
						});
						break;

                    case STATUS.ENTERING_LEVEL: // Le client a chargé le niveau, il est prèt à recevoir les
						data = this._gs.clientHasLoadedLevel(client);
						// transmettre au client la liste de tous les mobiles
						this._emit(client.id, 'G_CREATE_MOBILE', {mob: data.mobiles});
						this._emit(client.id, 'G_YOUR_ID', {id: client.id});
						// transmettre à tous les autres clients la création du client
						this._emit(data.players, 'G_CREATE_MOBILE', { mob: Game.buildMobileCreationPacket(data.subject) });
                        break;
                }
            } catch (e) {
                this.error(client, e);
            }
        });


        socket.on('REQ_G_UPDATE_PLAYER', (packet, ack) => {
			// appliquer la modification du mobile
			try {
				let id = client.id;
				// les packet doivent être joués.
				let aCorrPacket = this._gs.playClientMovement(id, packet);
				// on renvoie un packet contenant les dernière données validées/corrigées
				ack(aCorrPacket);
			} catch (e) {
				this.error(client, e);
			}
		});
    }
}

module.exports = ServiceGame;