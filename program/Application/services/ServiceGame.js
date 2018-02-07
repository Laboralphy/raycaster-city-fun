const ServiceAbstract = require('./Abstract');
const logger = require('../../Logger');
const STRINGS = require('../consts/strings');
const CentralProcessor = require('../model/CentralProcessor');

class ServiceLogin extends ServiceAbstract {
    constructor() {
        super();
        let cp = new CentralProcessor();
        cp.emitter.on('transmit', (id, event, data) => {
            this._emit(id, event, data);
        });
        this._cp = cp;
        this.events.on('service-login', ({client}) => {
            this._cp.clientIdentified(client);
        });
    }

    connectClient(client) {
        super.connectClient(client);
        let socket = client.socket;


    }
}

module.exports = ServiceLogin;