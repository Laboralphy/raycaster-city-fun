import STRINGS from "../data/strings";
import Game from "../game";
import CONFIG from "../game/config";

export default function createWebSocketPlugin (socket) {
	return store => {
		let chanCache = {};
		let userCache = {};
        let G;

		/// GAME
        function startGame() {
        	console.log('starting game...');
        	G = new Game();
            MAIN.configure(CONFIG);
            MAIN.run(G);
            MAIN.pointerlock.on('enter', event => {
                store.dispatch('ui/hide');
                G.hideOverlay();
                document.querySelector('canvas#screen').style.filter = '';
            });
            G.on('blur', event => {
                store.dispatch('ui/showSection', {id: 'chat'});
                store.dispatch('ui/show');
                document.querySelector('canvas#screen').style.filter = 'blur(5px)';
            });
            document.body.setAttribute('class', 'playing');
        }

        function endGame() {
			G._halt();
            document.body.setAttribute('class', '');
        }



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
				client: null,
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
				client: null,
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
				client: {id: oUser.id, name: oUser.name},
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


		store.subscribeAction(async (action) => {
			console.log(action);
			switch (action.type) {

				case 'clients/submit':
                    // le client souhaite se connecter
                    let id = await req_login(action.payload.login, action.payload.pass);
                    if (id) {
                        await store.dispatch('clients/info', {id, name: action.payload.login});
                        await store.dispatch('clients/setLocal', {id});
                        //
                        await store.dispatch('ui/hideSection', {id: 'login'});
                        await store.dispatch('ui/hide');
                        startGame();
                    } else {
                        // on a eu un soucis d'identification
                    }
					break;

				case 'chat/message':
                    send_ms_say(action.payload.tab, action.payload.message);
					break;
			}
		});
	}
}