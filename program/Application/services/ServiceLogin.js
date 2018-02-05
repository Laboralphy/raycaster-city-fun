const ServiceAbstract = require('./Abstract');
const logger = require('../../Logger');
const Config = require('../Config/index');
const STRINGS = require('../consts/strings')[Config.general.lang];

class ServiceLogin extends ServiceAbstract {
    constructor() {
        super();
    }

    connectClient(client) {
        super.connectClient(client);
        let socket = client.socket;

        /**
         * ### REQ_LOGIN
         * Un client souhaite s'identifier après s'etre connecté.
         * Il doit transmettre son nom et son mot de passe.
         * Le serveur retransmet immédiatement un identifiant client si l'identification réussit
         * si l'identification échoue, le serveur renvoie {id: null}
         * @param name {string} nom du client
         * @param pass {string} mot de passe du client
         * @param ack {Function}
         */
        socket.on('REQ_LOGIN', ({name, pass}, ack) => {
            // si le client est déja identifié...
            if (client.id) {
                ack({id: client.id});
            }
            if (name.length > 2) {
                client.name = name;
                client.id = socket.client.id;
                logger.logfmt(STRINGS.service.event.assign_name, client.id, client.name);
                this._share('service-login', {client});
                ack({id: client.id});
            } else {
                logger.logfmt(STRINGS.service.error.login_failed, client.id, client.name);
                client.id = null;
                ack({id: null});
            }
        });
    }
}

module.exports = ServiceLogin;