import login from '../wsplugins/login';
import ms from '../wsplugins/ms';
import engine from '../wsplugins/engine';
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