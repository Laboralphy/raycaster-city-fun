import login from './login';
import ms from './ms';
import engine from './engine';
import gamePlugins from '../../game/store-plugins';
import Game from '../../game/index';
import CONFIG from '../../config/index';

const socket = io(window.location.protocol + '//' + window.location.host);
const gameInstance = new Game(CONFIG);
MAIN.configure(CONFIG);

export default [
	login(socket),
	ms(socket),
	engine(socket, gameInstance),
	...gamePlugins.map(gp => gp(socket, gameInstance))
];