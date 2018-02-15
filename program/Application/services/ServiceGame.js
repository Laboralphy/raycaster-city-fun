const ServiceAbstract = require('./Abstract');
const logger = require('../../Logger');
const STRINGS = require('../consts/strings');
const STATUS = require('../consts/status');
const GameSystem = require('../model/GameSystem');

class ServiceGame extends ServiceAbstract {
    constructor() {
        super();
        let gs = new GameSystem();
		this._gs = gs;

		// Le game system va parfois transmettre de l'information
		// ces info sont transférées au réseau
        gs.emitter.on('transmit', (id, event, data) => {
            logger.log('transmit', event, 'to', id);
            this._emit(id, event, data);
        });

		// A l'écoute du service login. Dès qu'un client s'identifie, on passe l'identifiant au game systeme
        this.events.on('service-login', async ({client}) => {
            await this._gs.clientIdentified(client);
        });
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
         * Le client à besoin d'une resources (blueprint)
         */
        socket.on('G_LOAD_BP', async ({id}) => {

        });

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
						// transmettre à tous les autres clients la création du client
						this._emit(data.players, 'G_CREATE_MOBILE', {mob: data.subject});
                        break;
                }
            } catch (e) {
                this.error(client, e);
            }
        });

        socket.on('REQ_G_UPDATE_PLAYER', (packets, ack) => {
			// appliquer la modification du mobile
			try {
				let id = client.id;
				packets.forEach(({t, a, x, y, sx, sy, id, c}) => {
					console.log(t, a, x, y, sx, sy, id, c);
				});
				// on renvoie un packet contenant les dernière données validées/corrigées
				ack({

				});
			} catch (e) {
				this.error(client, e);
			}
		});
    }
}

module.exports = ServiceGame;