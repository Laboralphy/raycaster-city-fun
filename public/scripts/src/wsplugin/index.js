import Game from "../game";
import CONFIG from "../game/config";
import STATUS from "../../../../program/consts/status";

/**
 * Plugin de Vuex
 * Intercepte les actions dispatchée dans les composants.
 * Intercepte les messages réseaux issu du serveur.
 * Manage une instance de Game
 * Pour chaque action, on peut transmettre des données au serveur si on veut.
 *
 * @param socket
 * @returns {function(*=)}
 *
 * @var MAIN {*}
 */

const OVERLAY = false;

export default function createWebSocketPlugin (socket) {
	return store => {
		let chanCache = {};
		let userCache = {};

		let game;

		/**
		 * Démarrage du jeu...
		 * plein de chose à initialiser
		 */
		function gameInit() {
			MAIN.configure(CONFIG); 		// configurer le MAIN
			game = new Game(CONFIG);		// créer une instance du jeu
			MAIN.run(game);
			document.body.setAttribute('class', 'playing');

			/**
			 * Evenement de sortie du pointerlock
			 * Mettre à flou le canvas de jeu et afficher l'UI
			 */
			if (OVERLAY) {
				MAIN.pointerlock.on('exit', event => {
					game.showOverlay();
					store.dispatch('ui/showSection', {id: 'chat'});
					store.dispatch('ui/show');
					document.querySelector('canvas#screen').style.filter = 'blur(5px)';
				});

				/**
				 * Evènement d'entrée dans le pointerlock
				 * Cache l'interface et rétabli la netteté du canvas
				 */
				MAIN.pointerlock.on('enter', event => {
					store.dispatch('ui/hide');
					game.hideOverlay();
					document.querySelector('canvas#screen').style.filter = '';
				});

			}
			/**
			 * Evènement : le client a fini de construire le niveau
			 * Envoie un message "ready" pour indiquer qu'on est pret à jouer
			 */
			game.on('enter', async event => {
        Application.$root.$emit('game:ready', game)
            	send_g_ready(STATUS.ENTERING_LEVEL);
			});

			game.on('doomloop', () => {
        Application.$root.$emit('game:doomloop', game)
			})
			game.on('frame', event => {
				let player = game.getPlayer();
				let fAngle = player.fTheta;
				let x = player.x;
				let y = player.y;
			});

			/**
			 * Evènement : le client a bougé son mobile
			 * transmetter au serveur la nouvelle situation geometrique
			 */
			game.on('update.player', async packet => {
				let t1 = performance.now();
				let aCorrPacket = await req_g_update_player(packet);
				let t2 = performance.now();
				game.ping(t2 - t1);
				game.applyMobileCorrection(aCorrPacket);
			});
        }

		/**
		 * Fonction sensée terminer le jeu
		 */
        function endGame() {
			game._halt();
			MAIN.screen.style.display = 'none';
			socket.close();
			store.dispatch('ui/showSection', {id: 'disconnect'});
			store.dispatch('ui/show');
            document.body.setAttribute('class', '');
        }

        /**
		 * Affiche une erreur dans la console
         * @param s {string} libelle
         * @param e {string} erreur issu du serveur
         */
        function error(s, e) {
            console.group('error');
            console.error(s);
            console.error(e);
            console.groupEnd('error');
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
			endGame();
		});




		/**
		 * Envoi au serveur des données d'identification,
		 * renvoie par Promise un identifiant client si l'identification a réussi, sinon, renvoie null.
		 * @param name {string} nom
		 * @param pass {string}		if (this.isFree()) {
			this.oGame.gm_attack(0);
		} else {
			this.wtfHeld();
		}
		 this.nChargeStartTime = this.oGame.getTime();
		 mot de passe
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
			let oUser = await req_ms_user_info(user);
			let oChannel = await req_ms_chan_info(channel);
			await store.dispatch('chat/postLine', {
				tab: oChannel.id,
				client: null,
				message: oUser.name + ' quitte le canal ' + oChannel.name
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
			socket.emit('MS_SAY', {channel:tab, message});
		}















//  #####
// #     #    ##    #    #  ######
// #         #  #   ##  ##  #
// #  ####  #    #  # ## #  #####
// #     #  ######  #    #  #
// #     #  #    #  #    #  #
//  #####   #    #  #    #  ######






 //  ####           #          #     ####    #####  ######  #    #
 // #    #          #          #    #          #    #       ##   #
 // #               #          #     ####      #    #####   # #  #
 // #  ###          #          #         #     #    #       #  # #
 // #    #          #          #    #    #     #    #       #   ##
 //  ####           ######     #     ####      #    ######  #    #



		/**
		 * Serveur : vous recevez un message d'erreur suite à sa dernière requete
		 */
		socket.on('G_ERROR', ({err}) => {
			console.error(err);
		});

		/**
		 * Serveur : vous recevez les données du niveau dans lequel vous devez évoluer
		 */
		socket.on('G_LOAD_LEVEL', ({level, doors}) => {
			game.loadLevel(level);
		});

		/**
		 * Serveur : vous devez créer ce ou ces mobiles.
		 */
		socket.on('G_CREATE_MOBILE', async ({mob}) => {
			if (Array.isArray(mob)) {
				for (let i = 0, l = mob.length; i < l; ++i) {
					let m = mob[i];
					console.log('requesting', m.bp);
					await req_g_load_bp(m.bp);
					console.log('got', m.bp);
					game.netSpawnMobile(m);
				}
			} else {
				// tester si le blueprint est chargé
				await req_g_load_bp(mob.bp);
				game.netSpawnMobile(mob);
			}
		});

		socket.on('G_YOUR_ID', ({id}) => {
			game.localId(id);
		});

		/**
		 * Serveur : vous devez mettre à jour ce ou ces mobiles.
		 */
		socket.on('G_UPDATE_MOBILE', ({mob}) => {
			if (Array.isArray(mob)) {
				mob.forEach(mov => game.netUpdateMobile(mov));
			} else {
				game.netUpdateMobile(mob);
			}
		});

		/**
		 * Serveur : vous devez détruire ce ou ces mobiles.
		 */
		socket.on('G_DESTROY_MOBILE', ({mob}) => {
			if (Array.isArray(mob)) {
				mob.forEach(m => game.netDestroyMobile(m));
			} else {
				console.log(mob);
				game.netDestroyMobile(mob);
			}
		});












 //
 //  ####           #####   ######   ####
 // #    #          #    #  #       #    #
 // #               #    #  #####   #    #
 // #  ###          #####   #       #  # #
 // #    #          #   #   #       #   #
 //  ####           #    #  ######   ### #


		/**
		 * transmet le mouvement du joueur au serveur
		 * @param data.a {number} angle visé par le mobile (direction dans laquelle il "regarde")
		 * @param data.x {number} position x du mobile
		 * @param data.y {number} position y du mobile
		 * @param data.ma {number} angle adopté par le mouvement du mobile
		 * @param data.ms {number} vitesse déduite du mobile (avec ajustement collision murale etc...)
		 * @param data.c {number} commandes de tir, d'activation etc...
		 */
		async function req_g_update_player(packet) {
			return new Promise(resolve => {
				socket.emit('REQ_G_UPDATE_PLAYER', packet, data => resolve(data))
			});
		}


		async function req_g_load_bp(sResRef) {
			// télécharger le blueprint
			// vérifier si la tile attachée au blueprint est chargée
			// si non alors télécharger la tile
			// shader la tile
			// intégrer le blueprint
			return new Promise(resolve => {

				let rc = game.getRaycaster();
				let oHorde = rc.oHorde;

				if (sResRef in oHorde.oBlueprints) {
					// le blueprint est déja en mémoire
					resolve(oHorde.oBlueprints[sResRef]);
				} else {
					// envoyer une requète de chargement de ressource blueprint
					socket.emit('REQ_G_LOAD_RSC', {type: 'b', ref: sResRef}, blueprint => {

						/**
						 * Résoudre la promise en définissant le blueprint complet dans le raycaster
						 */
						function commitBP() {
							resolve(oHorde.defineBlueprint(sResRef, blueprint));
						}

						let sTileRef = blueprint.tile;
						if (sTileRef in oHorde.oTiles) {
							// la tile est déja définie
							commitBP();
						} else {
							// la tile n'est pas déja définie : effectuer une autre requète de chargement de ressource tile
							socket.emit('REQ_G_LOAD_RSC', {type: 't', ref: sTileRef}, tile => {
								let oTile = oHorde.defineTile(sTileRef, tile);

								/**
								 * Ombrer la tile nouvellemnet chargée puis résoudre la promise
								 */
								function shadeAndCommitBP() {
									commitBP();
									oTile.oImage = rc.shadeImage(oTile.oImage, true);
								}

								// l'image de la tile ...
								if (oTile.oImage.complete) {
									// ... est déja chargée
									shadeAndCommitBP()
								} else {
									// ... n'est pas déja chargée : on doit utiliser l'évènement load
									oTile.oImage.addEventListener('load', shadeAndCommitBP);
								}
							});
						}
					});
				}
			});
		}


 //
 //  ####            ####   ######  #    #  #####
 // #    #          #       #       ##   #  #    #
 // #                ####   #####   # #  #  #    #
 // #  ###               #  #       #  # #  #    #
 // #    #          #    #  #       #   ##  #    #
 //  ####            ####   ######  #    #  #####
 //

		/**
		 * phase 0:
		 * Lorsque le client a fini la phase d'identification et qu'il attend
		 * des données du serveur il utilise ce message pour indiquer qu'il est près à les
		 * recevoir.
		 *
		 * phase 1:
		 * Lorsque le client a fini de charger le niveau et qu'il attend les données concernant les élément dynamiques
		 * comme les mobiles
		 *
		 * phase 2:
		 * Lorsque le client a fini de recevoir les données des entité dynamique et souhaite prendre le controle d'un mobile
		 */
		function send_g_ready(phase) {
			socket.emit('G_READY', {phase});
		}














		//  ####   #    #  #####    ####    ####   #####      #    #####   ######
		// #       #    #  #    #  #       #    #  #    #     #    #    #  #
		//  ####   #    #  #####    ####   #       #    #     #    #####   #####
		//      #  #    #  #    #       #  #       #####      #    #    #  #
		// #    #  #    #  #    #  #    #  #    #  #   #      #    #    #  #
		//  ####    ####   #####    ####    ####   #    #     #    #####   ######


		store.subscribeAction(async (action) => {
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
                        gameInit();
                        send_g_ready(STATUS.GAME_INITIALIZED);
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
