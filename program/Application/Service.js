const Config = require('../Config');
const ClientManager = require('./ClientManager');
const TinyTxat = require('../TinyTxat');
const logger = require('../Logger');
const util = require('util');
const STRINGS = require('./consts/strings')[Config.general.lang];

class Service {
    constructor() {
        this.clientManager = new ClientManager();
        this.initMessageSystem();
    }

	/**
     * Initialisation du chat
	 */
	initMessageSystem() {
		this.txat = new TinyTxat.System();
		this.txat.on('user-joins', ({to, user, channel}) => to === user ? this.send_ms_you_join(to, channel) : this.send_ms_user_joins(to, user, channel));
		this.txat.on('user-leaves', ({to, user, channel}) => this.send_ms_user_leaves(to, user, channel));
		this.txat.on('user-message', ({to, user, channel, message}) => this.send_ms_user_message(to, user, channel, message));
        let c;

        c = new TinyTxat.Channel();
        c.id(1).name('system').type('system');
		this.txat.addChannel(c);

		c = new TinyTxat.Channel();
		c.id(2).name('public').type('public');
		this.txat.addChannel(c);
    }


    /**
     * Suppression du client de toutes les instances et les services
     * @param id {string}
     */
    destroyClient(id) {
        this.txat.dropUser(this.txat.findUser(id));
        this.clientManager.unregisterClient(id);
    }

    run(socket) {

        logger.log(STRINGS.service.user.connected, socket.client.id);

		let client = this.clientManager.register(socket.client.id);
		client.socket = socket;


		/**
         * Evènement : lorsqu'un client se déconnecte
		 */
		socket.on('disconnect', () => {
		    let id = socket.client.id;
            logger.log(STRINGS.service.user.disconnected, id);
            this.destroyClient(id);
        });



        /**
		 * ### LOGIN
         * Un client souhaite s'identifier après s'etre connecté. Il doit transmettre son nom et son mot de passe.
		 * Le serveur retransmet immédiatement un identifiant client
		 * @param login {string} nom du client
		 * @param pass {string} mot de passe du client
         */
        socket.on('LOGIN', ({name, pass}, ack) => {
        	if (name.length > 2) {
				client.name = name;
				client.id = socket.client.id;
				logger.log(util.format(STRINGS.service.user.assign_name, client.id, client.name));
				ack({id: client.id});

				// ajouter le client au canal public
				let oTxatUser = new TinyTxat.User(client);
				this.txat.addUser(oTxatUser);
				let oChannel = this.txat.findChannel(2);
				oChannel.addUser(oTxatUser);
			} else {
        		client.id = null;
				ack({id: client.id});
			}
        });
    }


	/**
	 * Renvoie la socket d'un client
	 * @param idClient {string} id du client
	 * @private
	 */
	_socket(idClient) {
    	return this.clientManager.client(idClient).socket;
	}

	_emit(idClient, sEvent, data) {
		logger.log('emit', sEvent, 'to', idClient);
		this._socket(idClient).emit(sEvent, data);
	}

    /**
     * avertir un client qu'il rejoin sur un canal
     * @param client {string} identifiant du client à prévenir
     * @param channel {string} information du canal concerné {id, name, type}
     */
    send_ms_you_join(client, channel) {
        let oChannel = this.txat.findChannel(channel);
		this._emit(client, 'MS_YOU_JOIN', {
			id: oChannel.id(),
			name: oChannel.name(),
			type: oChannel.type()
		});
    }

    /**
     * avertir un client de l'arrivée d'un utilisateur sur un canal
     * @param client {string} identifiant du client à prévenir
     * @param user {string} identifiant du client arrivant
     * @param channel {string} identifiant du canal concerné
     */
    send_ms_user_joins(client, user, channel) {
        let oChannel = this.txat.findChannel(channel);
		let oClient = this.txat.findUser(client);
		if (oChannel.userPresent(oClient)) {
			// le client appartient au canal
			this._emit(client, 'MS_USER_JOINS', {user, channel});
        }
    }

	/**
	 * Avertir un client du départ d'un autre client d'un canal
	 * @param client {string} identifiant du client à prévenir
	 * @param user {string} identifiant du client partant
	 * @param channel {string} identifiant du canal concerné
	 */
	send_ms_user_leaves(client, user, channel) {
		this._emit(client, 'MS_USER_LEAVES', {user, channel});
	}

	/**
	 * Transmettre le message d'un client à un autre
	 * @param client {string} identifiant du client destinataire
	 * @param user {string} identifiant du client expéditeur
	 * @param channel {string} identifiant du canal concerné / null si c'est un message privé
	 * @param message {string} contenu du message
	 */
	send_ms_user_message(client, user, channel, message) {
		this._emit(client, 'MS_USER_MESSAGE', {user, channel, message});
	}

}

module.exports = Service;