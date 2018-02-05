const Client = require('./Client');


class Manager {
	constructor() {
		this.clients = {};
	}

	/**
	 * Ajoute un client qui vient de se connecter
	 * @param id {string} identifiant du client
	 * @returns {null}
	 */
	register(id) {
		if (id in this.clients) {
			return this.clients[id];
		}
		let oClient = new Client();
		this.clients[id] = oClient;
		oClient.id = id;
		return oClient;
	}

	/**
	 * Supprime un client de la liste de gestion
	 * @param id {string}
	 */
	unregisterClient(id) {
		if (id in this.clients) {
			delete this.clients[id];
		}
	}

	/**
	 * Renvoie une instance client
	 * @param id {string} identifiant client recherché
	 */
	client(id) {
		if (id in this.clients) {
			return this.clients[id];
		} else {
			throw new Error('client ' + id + ' not found');
		}
	}
}

module.exports = Manager;