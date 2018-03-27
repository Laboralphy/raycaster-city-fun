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
import SocketAdapter from "../../../../../framework/engine/client/sockets";

const context = {
	socket: io(window.location.protocol + '//' + window.location.host),
	game: new Game(CONFIG)
};

const sa = new SocketAdapter(context);

// tambouille configurative
MAIN.configure(CONFIG);


function storePlugin({socket, game}) {
	return store => {

		sa.getAdapter('chat').on('postline', event => {
			store.dispatch('chat/postline', {
				tab: event.channel.id,
				client: event.client ? event.client.name : null,
				message: event.message
			});
		});

		store.subscribeAction(async (action) => {
			switch (action.type) {

				case 'clients/submit':
					// le client souhaite se connecter
					let id = await sa.getAdapter('login').req_login(action.payload.login, action.payload.pass);
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
					sa.getAdapter('engine').send_g_ready(STATUS.GAME_INITIALIZED);
					break;

				case 'chat/message':
					sa.getAdapter('chat').send_ms_say(action.payload.tab, action.payload.message);
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