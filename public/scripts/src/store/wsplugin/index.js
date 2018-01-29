import STRINGS from "../../data/strings";

export default function createWebSocketPlugin (socket) {
	return store => {
		let chanCache = {};
		let userCache = {};

		// GENERAL PURPOSE
		// GENERAL PURPOSE
		// GENERAL PURPOSE

		socket.on('connect', () => {
			chanCache = {};
			userCache = {};
		});

		/**
		 * Serveur : "Déconnexion du client"
		 */
		socket.on('disconnect', async () => {
		});

		// MS : MESSAGE SYSTEM
		// MS : MESSAGE SYSTEM
		// MS : MESSAGE SYSTEM


		/**
		 * Serveur : "vous venez de rejoindre un canal"
		 */
		socket.on('MS_YOU_JOIN', async ({id}) => {
			let oChannel = await req_ms_chan_info(id);
			if (oChannel) {
				await store.dispatch('chat/addTab', {id: oChannel.id, caption: oChannel.name});
				await store.dispatch('chat/selectTab', {id: oChannel.id});
			}
		});

		/**
		 * Serveur : "un utilisateur a rejoin l'un des canaux auxquels vous êtes connecté"
		 */
		socket.on('MS_USER_JOINS', async ({user, channel}) => {
			let oUser = await req_ms_user_info(user);
			let oChannel = await req_ms_chan_info(channel);
			await store.dispatch('chat/postLine', {
				tab: oChannel.id,
				client: '',
				message: STRINGS.ui.chat.joined.with({user: oUser.name, chan: oChannel.name})
			});
		});

		/**
		 * Serveur : "un utilisateur a quitté l'un des canaux auxquels vous êtes connecté"
		 */
		socket.on('MS_USER_LEAVES', async ({user, channel}) => {
			let oUser = await req_ms_user_info(user);
			let oChannel = await req_ms_chan_info(channel);
			await store.dispatch('chat/postLine', {
				tab: oChannel.id,
				client: '',
				message: STRINGS.ui.chat.left.with({user: oUser.name, chan: oChannel.name})
			});
		});

		/**
		 * Serveur : "un utilisateur a envoyé un message de discussion sur un canal"
		 */
		socket.on('MS_USER_SAYS', async ({user, channel, message}) => {
			let oUser = await req_ms_user_info(user);
			let oChannel = await req_ms_chan_info(channel);
			await store.dispatch('chat/postLine', {
				tab: oChannel.id,
				client: oUser.name,
				message
			});
		});







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
		async function req_login(name, pass) {
			return new Promise(
				resolve => {
					socket.emit(
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
		async function req_ms_chan_info(id) {
			return new Promise(
				resolve => {
					if (id in chanCache) {
						resolve(chanCache[id]);
					} else {
						socket.emit(
							'REQ_MS_CHAN_INFO',
							{id},
							(data) => {
								if (data) {
									chanCache[id] = data;
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
		async function req_ms_user_info(id) {
			return new Promise(
				resolve => {
					if (id in userCache) {
						resolve(userCache[id]);
					} else {
						socket.emit(
							'REQ_MS_USER_INFO',
							{id},
							async (data) => {
								if (data) {
									await store.dispatch('client')
									userCache[id] = data;
								}
								resolve(data);
							}
						);
					}
				}
			);
		}


		/**
		 * Chargement d'un niveau spécifique
		 * @param ref {string} référence du niveau
		 * @return {Promise<void>}
		 */
		async function req_lev_load(ref) {
			return new Promise(resolve => {
				socket.emit(
					'REQ_LEV_LOAD',
					{ref},
					(data) => {
						resolve(data);
					}
				)
			});
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
		function send_ms_say(tab, message) {
			socket.emit('MS_SAY', {channel:tab, message});
		}







		//  ####   #    #  #####    ####    ####   #####      #    #####   ######
		// #       #    #  #    #  #       #    #  #    #     #    #    #  #
		//  ####   #    #  #####    ####   #       #    #     #    #####   #####
		//      #  #    #  #    #       #  #       #####      #    #    #  #
		// #    #  #    #  #    #  #    #  #    #  #   #      #    #    #  #
		//  ####    ####   #####    ####    ####   #    #     #    #####   ######


		store.subscribe(async mutation => {
			switch (mutation.type) {
				case 'clients/login':
					// le client souhaite se connecter
					let id = await req_login(mutation.payload.login, mutation.payload.pass);
					await store.dispatch('clients/connect', {id, name: mutation.payload.login});
					await store.dispatch('clients/setLocal', {id});
					break;
			}
		});
	}
}