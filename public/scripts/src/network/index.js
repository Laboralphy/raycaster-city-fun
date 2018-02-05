import STRINGS from "../data/strings";

class Network {
	constructor() {
		this.store = null;
		this.chanCache = {};
		this.userCache = {};
		let sServerURL = window.location.protocol + '//' + window.location.host;
		this.socket = io(sServerURL);
		this.registerListeners();
	}

	// #          #     ####    #####  ######  #    #  ######  #####    ####
	// #          #    #          #    #       ##   #  #       #    #  #
	// #          #     ####      #    #####   # #  #  #####   #    #   ####
	// #          #         #     #    #       #  # #  #       #####        #
	// #          #    #    #     #    #       #   ##  #       #   #   #    #
	// ######     #     ####      #    ######  #    #  ######  #    #   ####

	registerListeners() {



		// GENERAL PURPOSE
		// GENERAL PURPOSE
		// GENERAL PURPOSE

		this.on('connect', () => {
			this.chanCache = {};
			this.userCache = {};
		});

		/**
		 * Serveur : "Déconnexion du client"
		 */
		this.on('disconnect', async () => {
		});


		// MS : MESSAGE SYSTEM
		// MS : MESSAGE SYSTEM
		// MS : MESSAGE SYSTEM

		/**
		 * Serveur : "vous venez de rejoindre un canal"
		 */
		this.on('MS_YOU_JOIN', async ({id}) => {
			let oChannel = await this.req_ms_chan_info(id);
			if (oChannel) {
				await this.store.dispatch('chat/addTab', {id: oChannel.id, caption: oChannel.name});
				await this.store.dispatch('chat/selectTab', {id: oChannel.id});
			}
		});

		/**
		 * Serveur : "un utilisateur a rejoin l'un des canaux auxquels vous êtes connecté"
		 */
		this.on('MS_USER_JOINS', async ({user, channel}) => {
			let oUser = await this.req_ms_user_info(user);
			let oChannel = await this.req_ms_chan_info(channel);
			await this.store.dispatch('chat/postLine', {
				tab: oChannel.id,
				client: '',
				message: STRINGS.ui.chat.joined.with({user: oUser.name, chan: oChannel.name})
			});
		});

		/**
		 * Serveur : "un utilisateur a quitté l'un des canaux auxquels vous êtes connecté"
		 */
		this.on('MS_USER_LEAVES', async ({user, channel}) => {
			let oUser = await this.req_ms_user_info(user);
			let oChannel = await this.req_ms_chan_info(channel);
			await this.store.dispatch('chat/postLine', {
				tab: oChannel.id,
				client: '',
				message: STRINGS.ui.chat.left.with({user: oUser.name, chan: oChannel.name})
			});
		});

		/**
		 * Serveur : "un utilisateur a envoyé un message de discussion sur un canal"
		 */
		this.on('MS_USER_SAYS', async ({user, channel, message}) => {
			let oUser = await this.req_ms_user_info(user);
			let oChannel = await this.req_ms_chan_info(channel);
			await this.store.dispatch('chat/postLine', {
				tab: oChannel.id,
				client: oUser.name,
				message
			});
		});
	}

	useStore(store) {
		this.store = store;
	}


	/**
	 * Passe plat vers socket.on
	 * @param sEvent {string} évènement
	 * @param pHandler {Function} callback
	 */
	on(sEvent, pHandler) {
		this.socket.on(sEvent, pHandler);
	}




	// #####   ######   ####   #    #  ######   ####    #####
	// #    #  #       #    #  #    #  #       #          #
	// #    #  #####   #    #  #    #  #####    ####      #
	// #####   #       #  # #  #    #  #            #     #
	// #   #   #       #   #   #    #  #       #    #     #
	// #    #  ######   ### #   ####   ######   ####      #

	// Les REQUEST sont des messages envoyés au serveur, qui déclenche un réponse de la part du serveur.
	// Les Request renvoient des promise.

	/**
	 * Envoi au serveur des données d'identification,
	 * renvoie par Promise un identifiant client si l'identification a réussi, sinon, renvoie null.
	 * @param name {string} nom
	 * @param pass {string} mot de passe
	 */
	async req_login(name, pass) {
		return new Promise(
			resolve => {
				this.socket.emit(
					'REQ_LOGIN',
					{name, pass},
					({id}) => resolve(id)
				)
			}
		);
	}

	/**
	 * Requète transmise au serveur : "Quelles sont les info relative à ce canal ?"
	 * On transmet l'id du canal recherché
	 * @param id {string} id du canal
	 * @returns {Promise<any>}
	 */
	async req_ms_chan_info(id) {
		return new Promise(
			resolve => {
				if (id in this.chanCache) {
					resolve(this.chanCache[id]);
				} else {
					this.socket.emit(
						'REQ_MS_CHAN_INFO',
						{id},
						(data) => {
							if (data) {
								this.chanCache[id] = data;
							}
							resolve(data);
						}
					);
				}
			}
		);
	}

	/**
	 * Requète transmise au serveur : "Quelles sont les info relative à cet utilisateur ?"
	 * On transmet l'id de l'utilisateur recherché
	 * @param id {string} id de l'utilisateur
	 * @returns {Promise<any>}
	 */
	async req_ms_user_info(id) {
		return new Promise(
			resolve => {
				if (id in this.userCache) {
					resolve(this.userCache[id]);
				} else {
					this.socket.emit(
						'REQ_MS_USER_INFO',
						{id},
						(data) => {
							if (data) {
								this.userCache[id] = data;
							}
							resolve(data);
						}
					);
				}
			}
		);
	}


	//  ####   ######  #    #  #####      #    #    #   ####
	// #       #       ##   #  #    #     #    ##   #  #    #
	//  ####   #####   # #  #  #    #     #    # #  #  #
	//      #  #       #  # #  #    #     #    #  # #  #  ###
	// #    #  #       #   ##  #    #     #    #   ##  #    #
	//  ####   ######  #    #  #####      #    #    #   ####

	// Méthodes d'envoi de données au serveur


	/**
	 * Envoi un message de discussion sur un canal donné.
	 * @param tab {String} identifiant du canal
	 * @param message {string} contenu du message
	 */
	send_ms_say(tab, message) {
		this.socket.emit('MS_SAY', {channel:tab, message});
	}
}

export default Network;