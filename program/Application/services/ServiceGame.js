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

    connectClient(client) {
        super.connectClient(client);
        let socket = client.socket;

        /**
         * Le client a fini son initialisation
         * on lui envoie un niveau
         */
        socket.on('G_READY', async ({}) => {
            // chargement d'un niveau
            try {
                let data = await this._gs.clientWantsToLoadLevel(client);
                this._emit(client.id, 'G_ENTER_LEVEL', {
                    level: data.area.data(),
                    doors: data.doors
                });
            } catch (e) {
                this._emit(client.id, 'G_ERROR', {
                    err: 'G_READY ' + e.toString()
                });
            }
        });
    }
}

module.exports = ServiceLogin;