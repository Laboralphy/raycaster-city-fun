const prop = require('../prop');
const Events = require('events');

class User {

    constructor() {
        this._id = null;
        this._sName = '';
        this._events = new Events();
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

    transmitMessage(uFrom, sMessage, cFrom) {
        this._events.emit('user-receive', {from: u, channel: cFrom, message: sMessage});
    }
}

module.exports = User;