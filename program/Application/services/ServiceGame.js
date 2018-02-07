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


        socket.on('REQ_DL_LEVEL', ({}, ack) => {
            // chargement d'un niveau
            let data = this._gs.clientWantsToLoadLevel(client);
            ack({
                level: data.area.data(),
                doors: data.doors
            });
        });
    }
}

module.exports = ServiceLogin;