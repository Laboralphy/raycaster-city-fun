
class Network {
	constructor() {
		let sServerURL = window.location.protocol + '//' + window.location.host;
		if (window.location.port) {
			sServerURL += ':' + window.location.port;
		}

		console.log('constructing');
		this.socket = io(sServerURL);
		this.registerHandlers()		;
	}


	registerHandlers(socket) {
		console.log('registering handler');
		/**
		 * Le serveur a accepté notre demande d'identification
		 */
		this.socket.on('LOGIN', ({id}) => console.log('numéro client', id));

		//this.socket.on('MS_LIST', ({channels}) => console.log('liste des cannaux', channels))
	}



	/**
	 * Envoie au server des données d'identification
	 * @param name {string} nom
	 * @param pass {string} mot de passe
	 */
	req_login(name, pass) {
		this.socket.emit('LOGIN', {name, pass});
	}

	req_ms_list() {
		this.socket.emit('MS_LIST');
	}
}

export default Network;