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
		this.txat.on('user-joins', ({to, user, channel}) => this.send_ms_user_joins(to, user, channel));
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
		socket.on('disconnect', (function () {
		    let id = socket.client.id;
            logger.log(STRINGS.service.user.disconnected, id);
            this.destroyClient(id);
        }).bind(this));



        /**
		 * ### LOGIN
         * Un client souhaite s'identifier après s'etre connecté. Il doit transmettre son nom et son mot de passe.
		 * @param login {string} nom du client
		 * @param pass {string} mot de passe du client
         */
        socket.on('LOGIN', function({login, pass}) {
            client.name = login;
			logger.log(util.format(STRINGS.service.user.assign_name, socket.client.id, client.name));
			this.send_login({client: client.id, id: client.id, name: client.name});

			// ajouter le client au canal public
			let oTxatUser = new TinyTxat.User(client);
			this.txat.addUser(oTxatUser);
			let oChannel = this.txat.findChannel(2);
			oChannel.addUser(oTxatUser);
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


	/**
	 * Envoie la confirmation d'identification à un client
	 * @param client
	 * @param id
	 * @param name
	 */
	send_login(client, id, name) {
		this._socket.emit('LOGIN', {id, name});
	}


	/**
	 * avertir un client de l'arrivée d'un utilisateur sur un canal
	 * @param client {string} identifiant du client à prévenir
	 * @param user {string} identifiant du client arrivant
	 * @param channel {string} identifiant du canal concerné
	 */
	send_ms_user_joins(client, user, channel) {
		logger.log('to', client, ': user', user, 'joins', channel);
		this._socket.emit('MS_USER_JOINS', {user, channel});
	}

	/**
	 * Avertir un client du départ d'un autre client d'un canal
	 * @param client {string} identifiant du client à prévenir
	 * @param user {string} identifiant du client partant
	 * @param channel {string} identifiant du canal concerné
	 */
	send_ms_user_leaves(client, user, channel) {
		this._socket.emit('MS_USER_LEAVES', {user, channel});
	}

	/**
	 * Transmettre le message d'un client à un autre
	 * @param client {string} identifiant du client destinataire
	 * @param user {string} identifiant du client expéditeur
	 * @param channel {string} identifiant du canal concerné / null si c'est un message privé
	 * @param message {string} contenu du message
	 */
	send_ms_user_message(client, user, channel, message) {
		this._socket.emit('MS_USER_MESSAGE', {user, channel, message});
	}

}

module.exports = Service;