const o876 = require('../../o876');
const EventEmitter = require('events');
const logger = require('../../Logger');
const STRINGS = require('../consts/strings');

class Abstract {

    constructor() {
        this._clientManager = null;
        this.events = new EventEmitter();
    }

    clientManager(cm) {
        return o876.SpellBook.prop(this, '_clientManager', cm);
    }

    disconnectClient(client) {}
    
    connectClient(client) {}

    /**
     * Renvoie la socket d'un client
     * @param idClient {string} id du client
     * @return {*}
     * @private
     */
    _socket(idClient) {
        return this.clientManager().client(idClient).socket;
    }

	/**
     * Emission d'un packet à destination d'un client
	 * @param idClient {string} identifiant destinataire
	 * @param sEvent {string} évènement
	 * @param data {*}
	 * @private
	 */
    _emit(idClient, sEvent, data) {
    	try {
			this._socket(idClient).emit(sEvent, data);
		} catch (e) {
			logger.logfmt(STRINGS.service.error.bad_client, idClient);
		}
    }

    /**
     * Transmet une information à tous les plugins
     * @param _event {string} nature de l'évènement
     * @param data {*} information supplémentaire
     */
    _share(_event, data) {
        this.events.emit('plugin-message', _event, data);
    }
}

module.exports = Abstract;
