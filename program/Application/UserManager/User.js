class User {
    constructor() {
        this.reset();
    }

    reset() {
        this.id = 0;
        this.name = '';
        this.socket = null;
    }

    display() {
        return this.name + '#' + this.id;
    }
}


module.exports = User;