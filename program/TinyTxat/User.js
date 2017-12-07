const prop = require('../prop');
const Events = require('events');

class User {

    constructor() {
        this._id = null;
        this._sName = '';
        this._events = new Events();
    }

    on(sEvent, pHandler) {
        this._events.on(sEvent, pHandler);
        return this;
    }

    id(id) {
        return prop(this, '_id', id);
    }

    name(s) {
        return prop(this, '_sName', s);
    }

    /**
     * Affiche une ligne de description pour les logs
     * @return {string}
     */
    display() {
        return '#' + this.id() + ' (' + this.name() + ')';
    }

    sendMessage(oDestination, sMessage) {
		oDestination.transmitMessage(this, sMessage);
    }

    transmitMessage(uFrom, sMessage, cFrom) {
        this._events.emit('message-received', {from: uFrom, to: this, channel: cFrom, message: sMessage});
    }
}

module.exports = User;