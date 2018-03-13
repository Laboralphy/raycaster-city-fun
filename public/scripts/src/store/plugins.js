import login from '../store-plugins/login';
import ms from '../store-plugins/ms';
import engine from '../store-plugins/engine';
import Game from '../game';
import CONFIG from '../config';

const socket = io(window.location.protocol + '//' + window.location.host);
const gameInstance = new Game(CONFIG);
MAIN.configure(CONFIG);

export default [
	login(socket, gameInstance),
	ms(socket, gameInstance),
	engine(socket, gameInstance)
];