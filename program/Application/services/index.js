const Config = require('../../Config/index');
const ClientManager = require('../ClientManager/index');
const TinyTxat = require('../../TinyTxat/index');
const logger = require('../../Logger/index');
const level = require('../../level/index');

const util = require('util');
const STRINGS = require('../consts/strings')[Config.general.lang];


const ServiceTxat = require('./ServiceTxat');

class Service {
    constructor() {
        this.clientManager = new ClientManager();
        this._plugins = [];
    }

    plugin(instance) {
        instance.on('message',
            data =>
                this._plugins.forEach(p =>
                    p.events.emit('message', data)
                )
        );
        this._plugins.push(instance);
    }

    /**
     * Suppression du client de toutes les instances et les services
     * @param client {*}
     */
    destroyClient(client) {
        let id = client.id;
        this._plugins.forEach(p => p.disconnect(client));
        this.clientManager.unregisterClient(id);
    }

    run(socket) {
        logger.logfmt(STRINGS.service.event.connected, socket.client.id);
        let client = this.clientManager.register(socket.client.id);
        client.socket = socket;

        /**
         * Evènement : lorsqu'un client se déconnecte
         */
        socket.on('disconnect', () => {
            let id = socket.client.id;
            logger.logfmt(STRINGS.service.event.disconnected, id);
            this.destroyClient(client);
        });



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
                ack({id: client.id});

                // ajouter le client au canal public
                let oTxatUser = new TinyTxat.User(client);
                this.txat.addUser(oTxatUser);
                let oChannel = this.txat.findChannel(2);
                oChannel.addUser(oTxatUser);
            } else {
                logger.logfmt(STRINGS.service.error.login_failed, client.id, client.name);
                client.id = null;
                ack({id: null});
            }
        });
    }
}

module.exports = Service;