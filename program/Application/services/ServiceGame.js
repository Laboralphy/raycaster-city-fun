const ServiceAbstract = require('./Abstract');
const logger = require('../../Logger');
const STRINGS = require('../consts/strings');
const GameSystem = require('../model/GameSystem');

class ServiceLogin extends ServiceAbstract {
    constructor() {
        super();
        let gs = new GameSystem();
        gs.emitter.on('transmit', (id, event, data) => {
            logger.log('transmit', event, 'to', id);
            this._emit(id, event, data);
        });
        this._gs = gs;
        this.events.on('service-login', ({client}) => {
            this._gs.clientIdentified(client);
        });
    }

    error(client, e) {
        let msg = e.toString();
        console.err(e.stack);
        logger.err(msg);
        this._emit(client.id, 'G_ERROR', {
            err: msg
        });
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
        socket.on('G_LOAD_BP', async({id}) => {

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
                    case 0: // le client est pret à recevoir les données d'un niveau
						data = await this._gs.clientWantsToLoadLevel(client);
						this._emit(client.id, 'G_LOAD_LEVEL', {
							level: data.area.data(),
							doors: data.doors
						});
						break;

                    case 1: // Le client a chargé le niveau, il est prèt à recevoir les
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
    }
}

module.exports = ServiceLogin;