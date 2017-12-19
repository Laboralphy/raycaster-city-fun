const Config = require('../Config');
const UserManager = require('../UserManager');
const TinyTxat = require('../TinyTxat');
const logger = require('../Logger');

class Service {
    constructor() {
        this.userManager = new UserManager();
        this.txat = new TinyTxat.System();
    }

    /**
     * Nettoyage de socket avant desctruction
     * @param socket
     */
    cleanSocket(socket) {
        function cleanProp(sProp) {
            if (sProp in socket) {
                delete socket[sProp];
            }
        }
        cleanProp('__user');
    }

    /**
     * Suppression du client de toutes les instances et les services
     * @param u {User}
     */
    destroyClient(u) {
        this.txat.dropUser(this.txat.findUser(u.id));
        this.userManager.removeUser(u.id);
    }

    run(socket) {
        logger.log('user connected', socket.address);
        socket.on('disconnect', (function () {
            let u = socket.__user;
            logger.log('user disconnected', u ? u.display() : 'not authenticated');
            if (u) {
                this.destroyClient(u);
                this.cleanSocket(socket);
            }
        }).bind(this));

        /**
         * Message de connexion d'un client, Verifier login/pass
         * Attribuer un identifiant
         * refourger l'identifiant au client
         * avertir les autres services
         */
        socket.on('CLIENT_LOGIN', function({login, pass}) {
            let u = this.userManager.newUser(login, pass);
            if (u) {
                u.socket = socket;
                socket.__user = u;
                this.txat.addUser(new TinyTxat.User(u));
            }
        });
    }
}

modules.exports = Service;