const o876 = require('../../o876');
const EventEmitter = require('events');

class Abstract {

    constructor() {
        this._clientManager = null;
        this.events = new EventEmitter();
    }

    clientManager(cm) {
        return o876.SpellBook.prop(this, '_clientManager', cm);
    }

    disconnectClient(client) {}

    /**
     * Renvoie la socket d'un client
     * @param idClient {string} id du client
     * @private
     */
    _socket(idClient) {
        return this.clientManager().client(idClient).socket;
    }

    _emit(idClient, sEvent, data) {
        this._socket(idClient).emit(sEvent, data);
    }

    /**
     * Transmet une information à tous les plugins
     */
    _share(_event, data) {
        this.events.emit('message', Object.assign({}, { _event }, data));
    }
}

module.exports = Abstract;
