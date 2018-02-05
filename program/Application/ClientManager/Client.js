/**
 * Permet d'associer un client à une zone de données persistante
 */
class Client {
	constructor() {
		this.reset();
	}

	/**
	 * Remise à zéro des données d'un client
	 */
	reset() {
		this.id = '';
		this.idStorage = 0;
		this.name = '';
		this.socket = null;
	}

	/**
	 * Renvoie le nom affichable d'un client
	 * @returns {string}
	 */
	display() {
		return this.name + '#' + this.id;
	}
}


module.exports = Client;