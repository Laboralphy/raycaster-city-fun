
class Network {
	constructor() {
		this.chanCache = {};
		this.userCache = {};
		let sServerURL = window.location.protocol + '//' + window.location.host;
		this.socket = io(sServerURL);
		this.registerHandlers();
	}

	setVueApplication(vueApp) {
		this.vueApp = vueApp;
	}

	vue() {
		return this.vueApp;
	}

	registerHandlers() {
		this.on('connect', () => this.connected());
	}

	/**
	 * Passe plat vers socket.on
	 * @param sEvent {string} évènement
	 * @param pHandler {Function} callback
	 */
	on(sEvent, pHandler) {
		this.socket.on(sEvent, pHandler);
	}


	 // #          #     ####    #####  ######  #    #  ######  #####    ####
	 // #          #    #          #    #       ##   #  #       #    #  #
	 // #          #     ####      #    #####   # #  #  #####   #    #   ####
	 // #          #         #     #    #       #  # #  #       #####        #
	 // #          #    #    #     #    #       #   ##  #       #   #   #    #
	 // ######     #     ####      #    ######  #    #  ######  #    #   ####

	/**
	 * Réagit à la connexion au serveur
	 */
	connected() {
		this.chanCache = {};
		this.userCache = {};
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