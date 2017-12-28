const User = require('./User');

class Manager {
    constructor() {
        this.users = [];
        this.lastId = 0;
    }

    static isValidName(s) {
        return !!s.trim().length;
    }

    newUser(login, pass) {
        if (this.users.some(u => u.name === login)) {
            return null;
        }
        if (!Manager.isValidName(login)) {
            return null;
        }
        let u = new User();
        u.id = ++this.lastId;
        u.name = login;
        this.users.push(u);
        return u;
    }

    removeUser(id) {
        let n = this.users.findIndex(u => u.id === id);
        if (n >= 0) {
            this.users.splice(n, 1);
        }
    }
}

module.exports = Manager;