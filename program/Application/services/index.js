const Config = require('../Config');
const ClientManager = require('../ClientManager/index');
const TinyTxat = require('../../TinyTxat/index');
const logger = require('../../Logger/index');

const util = require('util');
const STRINGS = require('../consts/strings')[Config.general.lang];

class Service {
    constructor() {
        this.clientManager = new ClientManager();
        this._plugins = [];
        this
            .plugin('ServiceLogin')
            .plugin('ServiceTxat');
    }

	/**
     * Ajoute un plgin à la liste des plugin de service
	 * @param instance {string|object}
	 * @returns {*}
	 */
	plugin(instance) {
        if (typeof instance === 'string') {
            let pClass = require('./' + instance);
            let oInstance = new pClass();
            oInstance.clientManager(this.clientManager);
			return this.plugin(oInstance);
        }
        instance.events.on('plugin-message',
            (_event, data) => {
				this._plugins.forEach(p => {
					p.events.emit(_event, data);
				});
			}
        );
        logger.logfmt(STRINGS.service.plugin_loaded, instance.constructor.name);
        this._plugins.push(instance);
        return this;
    }

    /**
     * Suppression du client de toutes les instances et les services
     * @param client {*}
     */
    destroyClient(client) {
        let id = client.id;
        this._plugins.forEach(p => p.disconnectClient(client));
        this.clientManager.unregisterClient(id);
    }

	/**
     * Invoquée à chaque connection d'un client
	 * @param socket
	 */
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

        this._plugins.forEach(p => p.connectClient(client));
    }
}

module.exports = Service;