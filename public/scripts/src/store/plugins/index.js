/**
 * Importation de plugin de jeu
 */
// Tout plugin de jeu aditionnel sera automatiquement pris en compte s'il se situe dans le répertoire ../../game/store-plugins
// pour le déclarer proprement, éditer ../../game/store-plugins/index

import gamePlugins from '../../game/store-plugins';

/**
 * Importation de la classe de jeu et de la config
 */
import Game from '../../game/index';
import CONFIG from '../../config/index';
import STATUS from "../../../../../framework/consts/status";
import SocketAdapter from "../../../../../framework/engine/client-side/socket-adapters";

const context = {
	socket: io(window.location.protocol + '//' + window.location.host),
	game: new Game(CONFIG)
};

const oSocketAdapter = new SocketAdapter(context);

// tambouille configurative
MAIN.configure(CONFIG);


function storePlugin({socket, game}) {
	return store => {

		// adapteurs de socket
		const sock = oSocketAdapter.getAdapters();

		/**
		 * Il y a plusieurs adapteurs de socket
		 *
		 * chat : ne gère que les messages réseaux concernant le chat
		 * engine : ne gère que les messages réseaux concernant le moteur de jeu (synchro client, mobile, portes, chargement resources ou niveaux....)
		 * login : ne gère que les messages réseaux concernant l'identification du client
		 * ...
		 */


		/**
		 * Ecouter les évènements issus des adapter de sockets
		 */

		sock.chat.emitter.on('postline', event => {
			store.dispatch('chat/postLine', {
				tab: event.id,
				client: event.client ? event.client : null,
				message: event.message
			});
		});

		sock.chat.emitter.on('newchan', async event => {
			await store.dispatch('chat/addTab', {
				id: event.id,
				caption: event.name
			});
			await store.dispatch('chat/selectTab', {
				id: event.id
			});
		});

		store.subscribeAction(async (action) => {
			switch (action.type) {

				case 'clients/submit':
					// le client souhaite se connecter
					let id = await sock.login.req_login(action.payload.login, action.payload.pass);
					if (id) {
						await store.dispatch('clients/info', {id, name: action.payload.login});
						await store.dispatch('clients/setLocal', {id});
						//
						await store.dispatch('ui/hideSection', {id: 'login'});
						await store.dispatch('ui/hide');
					} else {
						// on a eu un soucis d'identification
					}
					break;

				case 'clients/setLocal':
					sock.engine.send_ready(STATUS.GAME_INITIALIZED);
					break;

				case 'chat/message':
					sock.chat.send_say(action.payload.tab, action.payload.message);
					break;
			}
		});
	};
}




export default [

	// plugin de base
	storePlugin(context),

	// game plugins
	...gamePlugins.map(gp => gp(context))

	// autres plugins
];