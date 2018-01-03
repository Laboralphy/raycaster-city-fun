
class Network {
	constructor() {
		let sServerURL = window.location.protocol + '//' + window.location.host;
		console.log('connecting to', sServerURL);
		this.socket = io(sServerURL);
		this.registerHandlers();
	}


	registerHandlers() {
		this.socket.on('connect', () => console.log('connected'));
		this.socket.on('disconnect', () => console.log('disconnected'));

		//this.socket.on('MS_LIST', ({channels}) => console.log('liste des cannaux', channels))

		//this.socket.on('MS_USER_JOINS', ({user, channel}) => );
	}




	/**
	 * Envoi au server des données d'identification, renvoie par Promise un identifiant client si l'identification a
	 * réussi, sinon, renvoie null.
	 *
	 * @param name {string} nom
	 * @param pass {string} mot de passe
	 */
	async send_login(name, pass) {
		return new Promise(
			resolve => {
				this.socket.emit(
					'LOGIN',
					{name, pass},
					({id}) => resolve(id)
				)
			}
		);
	}




}

export default Network;