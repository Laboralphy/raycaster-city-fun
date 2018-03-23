/**
 * Importation de plugin de jeu
 */
import gamePlugins from '../../game/store-plugins';

// Tout plugin de jeu aditionnel sera automatiquement pris en compte s'il se situe dans le répertoire ../../game/store-plugins
// pour le déclarer proprement, éditer ../../game/store-plugins/index





/**
 * Importation des plugins architecturaux
 * Ces plugins sont situés dans le répertoire framework
 */
import login from '../../../../../framework/engine/client/store-plugins/login';
import ms from '../../../../../framework/engine/client/store-plugins/ms';
import engine from '../../../../../framework/engine/client/store-plugins/engine';

/**
 * Importation de la classe de jeu et de la config
 */
import Game from '../../game/index';
import CONFIG from '../../config/index';


const socket = io(window.location.protocol + '//' + window.location.host);
const gameInstance = new Game(CONFIG);
MAIN.configure(CONFIG);

export default [
	login(socket),
	ms(socket),
	engine(socket, gameInstance),

	// plugin de jeu
	...gamePlugins.map(gp => gp(socket, gameInstance))
	// autres plugins
];