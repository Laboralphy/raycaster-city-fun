import login from '../wsplugins/login';
import ms from '../wsplugins/ms';
import game from '../wsplugins/game';

const socket = io(window.location.protocol + '//' + window.location.host);

export default [
	login(socket),
	ms(socket),
	game(socket)
];