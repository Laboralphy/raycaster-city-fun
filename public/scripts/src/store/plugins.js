import login from '../wsplugins/login';
import ms from '../wsplugins/ms';
import engine from '../wsplugins/engine';

const socket = io(window.location.protocol + '//' + window.location.host);

export default [
	login(socket),
	ms(socket),
	engine(socket)
];