const Events = require('events');


class System {

    constructor() {
        this._users = [];
        this._channels = [];
        this._events = new Events();
    }

    channelPresent(c) {
        return this._channels.indexOf(c) >= 0;
    }

    userPresent(u) {
        return this._users.indexOf(u) >= 0;
    }

    eventUserJoins(event) {
        this._events.emit('user-joins', {
            user: event.user.id(),
            channel: event.channel.id()
        });
    }

    eventUserLeaves(event) {
        this._events.emit('user-leaves', {
            user: event.user.id(),
            channel: event.channel.id()
        });
    }

    eventUserGotMessage(event) {
        this._events.emit('user-message', {
            user: event.user.id(),
            channel: event.channel ? event.channel.id() : null,
            message: event.message
        });
    }

    addUser(u) {
        if (!this.userPresent(u)) {
            this._users.push(u);
            u.on('user-receive', event => this.eventUserGotMessage(event));
        } else {
            throw new Error('user ' + u.display() + ' is already registered on the system');
        }
    }

    dropUser(u) {
        if (!this.userPresent(u)) {
            // remove from all channels
            this._channels.forEach(function(c) {
                if (c.userPresent(u)) {
                    c.dropUser(u);
                }
            });
            let i = this._users.indexOf(u);
            this._users.splice(i, 1);
        } else {
            throw new Error('user ' + u.display() + ' is already registered on the system');
        }
    }

    addChannel(c) {
        if (!this.channelPresent(c)) {
            this._channels.push(c);
            c.on('user-added', event => this.eventUserJoins(event))
            c.on('user-dropped', event => this.eventUserLeaves(event))
        } else {
            throw new Error('cannot register channel ' + c.display() + ' : already registered');
        }
    }

    dropChannel(c) {
        if (this.channelPresent(c)) {
            c.purge();
            let i = this._channels.indexOf(c);
            this._channels.splice(i, 1);
            this._events.emit('channel-dropped', {channel: c});
        } else {
            throw new Error('cannot register channel ' + c.display() + ' : already registered');
        }
    }
}

modules.exports = System;