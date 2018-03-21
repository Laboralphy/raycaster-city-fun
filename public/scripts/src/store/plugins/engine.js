import STATUS from "../../../../../program/consts/status";

const OVERLAY = true;

function engine(socket, game) {
	// étant donné que c'est une couche architectural, on ne doit pas surchager de store.dispatch
	// chaque appli à ses propres actions
	return store => {

		//  #####
		// #     #    ##    #    #  ######
		// #         #  #   ##  ##  #
		// #  ####  #    #  # ## #  #####
		// #     #  ######  #    #  #
		// #     #  #    #  #    #  #
		//  #####   #    #  #    #  ######


		/**
		 * Démarrage du jeu...
		 * plein de chose à initialiser
		 */
		function gameInit() {
			MAIN.run(game);
			document.body.setAttribute('class', 'playing');

			/**
			 * Evenement de sortie du pointerlock
			 * Mettre à flou le canvas de jeu et afficher l'UI
			 */
			if (OVERLAY) {
				MAIN.pointerlock.on('exit', event => {
					game.trigger('pointer.unlock');
				});

				/**
				 * Evènement d'entrée dans le pointerlock
				 * Cache l'interface et rétabli la netteté du canvas
				 */
				MAIN.pointerlock.on('enter', event => {
					game.trigger('pointer.lock');
				});
			}
			/**
			 * Evènement : le client a fini de construire le niveau
			 * Envoie un message "ready" pour indiquer qu'on est pret à jouer
			 */
			game.on('enter', async event => {
				send_g_ready(STATUS.ENTERING_LEVEL);
			});

			game.on('frame', event => {
			});

			/**
			 * Evènement : le client a bougé son mobile
			 * transmetter au serveur la nouvelle situation geometrique
			 */
			game.on('player.update', async packet => {
				let t1 = performance.now();
				let aCorrPacket = await req_g_update_player(packet);
				let t2 = performance.now();
				game.ping(t2 - t1);
				game.applyMobileCorrection(aCorrPacket);
			});

			game.trigger('socket', {socket});
		}

		/**
		 * Fonction sensée terminer le jeu
		 */
		function gameEnd() {
			game._halt();
			MAIN.screen.style.display = 'none';
			socket.close();
			document.body.setAttribute('class', '');
			game.trigger('halt');
		}


		//  ####           #          #     ####    #####  ######  #    #
		// #    #          #          #    #          #    #       ##   #
		// #               #          #     ####      #    #####   # #  #
		// #  ###          #          #         #     #    #       #  # #
		// #    #          #          #    #    #     #    #       #   ##
		//  ####           ######     #     ####      #    ######  #    #


		/**
		 * Serveur : "Déconnexion du client"
		 */
		socket.on('disconnect', async () => {
			gameEnd();
		});

		/**
		 * Serveur : vous recevez un message d'erreur suite à sa dernière requete
		 */
		socket.on('G_ERROR', ({err}) => {
			console.error(err);
		});

		/**
		 * Serveur : vous recevez les données du niveau dans lequel vous devez évoluer
		 */
		socket.on('G_LOAD_LEVEL', ({level, live}) => {
			game.loadLevel(level, live);
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
				socket.emit('REQ_G_UPDATE_PLAYER', packet, data => resolve(data));
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
				case 'clients/setLocal':
					gameInit();
					send_g_ready(STATUS.GAME_INITIALIZED);
					break;
			}
		});
	};
}

export default engine;