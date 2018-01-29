import wsplugin from './wsplugin';

export default [
	wsplugin(io(window.location.protocol + '//' + window.location.host))
];