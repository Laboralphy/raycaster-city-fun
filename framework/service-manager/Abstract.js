const o876 = require('../o876/index');
const EventEmitter = require('events');
const logger = require('../logger/index');
const STRINGS = require('../consts/strings');

class Abstract {

    constructor() {
        this._clientManager = null;
        this.events = new EventEmitter();
        ('on one off trigger').split().forEach(m => {
        	this[m] = (...args) => this.events[m](...args)
		});
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
     * @protected
     */
    _socket(idClient) {
        return this.clientManager().client(idClient).socket;
    }

	/**
     * Emission d'un packet à destination d'un client
	 * @param idClient {string|string[]} identifiant ou liste d'identifiants destinataire
	 * @param sEvent {string} évènement
	 * @param data {*}
	 * @protected
	 */
    _emit(idClient, sEvent, data) {
    	try {
    		if (Array.isArray(idClient)) {
				idClient.forEach(id => {
					this._emit(id, sEvent, data);
				});
			} else {
				this._socket(idClient).emit(sEvent, data);
			}
		} catch (e) {
			logger.errfmt(STRINGS.service.could_not_emit, sEvent, idClient);
			console.error(data);
			console.error(e.stack);
		}
    }

    /**
     * Transmet une information à tous les plugins
     * @param _event {string} nature de l'évènement
     * @param data {*} information supplémentaire
     */
    _broadcast(_event, data) {
        this.events.emit('plugin-message', _event, data);
    }
}

module.exports = Abstract;
