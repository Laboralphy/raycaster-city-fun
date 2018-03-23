import STATUS from "../../../consts/status";

function ms(socket) {
	return store => {
		// #    #  ######   ####    ####     ##     ####   ######
		// ##  ##  #       #       #        #  #   #    #  #
		// # ## #  #####    ####    ####   #    #  #       #####
		// #    #  #            #       #  ######  #  ###  #
		// #    #  #       #    #  #    #  #    #  #    #  #
		// #    #  ######   ####    ####   #    #   ####   ######
		//
		//
		//  ####    #   #   ####    #####  ######  #    #
		// #         # #   #          #    #       ##  ##
		//  ####      #     ####      #    #####   # ## #
		//      #     #         #     #    #       #    #
		// #    #     #    #    #     #    #       #    #
		//  ####      #     ####      #    ######  #    #


		// #    #   ####           #          #     ####    #####  ######  #    #
		// ##  ##  #               #          #    #          #    #       ##   #
		// # ## #   ####           #          #     ####      #    #####   # #  #
		// #    #       #          #          #         #     #    #       #  # #
		// #    #  #    #          #          #    #    #     #    #       #   ##
		// #    #   ####           ######     #     ####      #    ######  #    #


		let chanCache = {};
		let userCache = {};


		socket.on('connect', () => {
			chanCache = {};
			userCache = {};
		});

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
				client: null,
				message: oUser.name + ' rejoint le canal ' + oChannel.name
			});
		});

		/**
		 * Serveur : "un utilisateur a quitté l'un des canaux auxquels vous êtes connecté"
		 */
		socket.on('MS_USER_LEAVES', async ({user, channel}) => {
			let oChannel = await req_ms_chan_info(channel);
			await store.dispatch('chat/postLine', {
				tab: oChannel.id,
				client: null,
				message: user.name + ' quitte le canal ' + oChannel.name
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
				client: {id: oUser.id, name: oUser.name},
				message
			});
		});


		// #    #   ####           #####   ######   ####
		// ##  ##  #               #    #  #       #    #
		// # ## #   ####           #    #  #####   #    #
		// #    #       #          #####   #       #  # #
		// #    #  #    #          #   #   #       #   #
		// #    #   ####           #    #  ######   ### #


		// Les REQUEST sont des messages envoyés au serveur, qui déclenche un réponse de la part du serveur.
		// Les Request renvoient des promise.


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
									// il n'y a pas de registre de canaux dans le state
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
					if (id in store.state.clients) {
						resolve(store.state.clients[id]);
					} else {
						socket.emit(
							'REQ_MS_USER_INFO',
							{id},
							async (data) => {
								if (data) {
									store.commit('clients/info', {id, name: data.name});
								}
								resolve(data);
							}
						);
					}
				}
			);
		}


		// #    #   ####            ####   ######  #    #  #####
		// ##  ##  #               #       #       ##   #  #    #
		// # ## #   ####            ####   #####   # #  #  #    #
		// #    #       #               #  #       #  # #  #    #
		// #    #  #    #          #    #  #       #   ##  #    #
		// #    #   ####            ####   ######  #    #  #####

		/**
		 * Envoi un message de discussion sur un canal donné.
		 * @param tab {String} identifiant du canal
		 * @param message {string} contenu du message
		 */
		function send_ms_say(tab, message) {
			socket.emit('MS_SAY', {channel: tab, message});
		}


		//  ####   #    #  #####    ####    ####   #####      #    #####   ######
		// #       #    #  #    #  #       #    #  #    #     #    #    #  #
		//  ####   #    #  #####    ####   #       #    #     #    #####   #####
		//      #  #    #  #    #       #  #       #####      #    #    #  #
		// #    #  #    #  #    #  #    #  #    #  #   #      #    #    #  #
		//  ####    ####   #####    ####    ####   #    #     #    #####   ######


		store.subscribeAction(async (action) => {
			switch (action.type) {
				case 'chat/message':
					send_ms_say(action.payload.tab, action.payload.message);
					break;
			}
		});
	};
}

export default ms;