const prop = require('../prop');
const Events = require('events');

class Channel {
    constructor() {
        this._users = [];
        this._id = null;
        this._sName = '';
        this._sType = ''
        this._events = new Events();
    }

    id(id) {
        return prop(this, '_id', id);
    }

    name(s) {
        return prop(this, '_sName', s);
    }

    type(s) {
        return prop(this, '_sType', s);
    }

    display() {
        return '#' + this.id() + ' (' + this.name() + ')';
    }

    userPresent() {
        return this._users.indexOf(u) >= 0;
    }

    addUser(u) {
        if (!this.userPresent(u)) {
            this._users.push(u);
            this._events.emit('user-added', {channel: c, user: u});
        } else {
            throw new Error('cannot add user ' + u.display() + ' in channel ' + this.display() + ' : already registered');
        }
    }

    dropUser(u) {
        if (this.userPresent()) {
            let i = this._users.indexOf(u);
            this._users.splice(i, 1);
            this._events.emit('user-dropped', {channel: c, user: u});
        } else {
            throw new Error('cannot drop user ' + u.display() + ' from channel ' + this.display() + ' : not registered');
        }
    }

    purge() {
        while (this._users.length) {
            this.dropUser(this._users[0]);
        }
    }

    /**
     * diffuse un message a tous els utilisateur du canal
     * @param u {User}
     * @param sMessage {string}
     */
    transmitMessage(u, sMessage) {
        this._users.forEach(udest => udest.transmitMessage(u, sMessage, this));
    }
}

module.exports = Channel;