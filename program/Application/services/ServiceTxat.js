const ServiceAbstract = require('./Abstract');
const TinyTxat = require('../../TinyTxat/index');

class ServiceTxat extends ServiceAbstract {


    constructor() {
        super();
        this.txat = new TinyTxat.System();
        this.txat.on('user-joins', ({to, user, channel}) => {
            to === user ? this.send_ms_you_join(to, channel) : this.send_ms_user_joins(to, user, channel)
        });
        this.txat.on('user-leaves', ({to, user, channel}) => this.send_ms_user_leaves(to, user, channel));
        this.txat.on('user-message', ({to, user, channel, message}) => this.send_ms_user_says(to, user, channel, message));
        let c;

        c = new TinyTxat.Channel();
        c.id(1).name('system').type('system');
        this.txat.addChannel(c);

        c = new TinyTxat.Channel();
        c.id(2).name('public').type('public');
        this.txat.addChannel(c);
    }

    disconnectClient(client) {
        this.txat.dropUser(this.txat.findUser(client.id));
    }

    /**
     * ajout d'un client
     */
    connectClient(client) {
        let socket = client.socket;
        /**
         * ### REQ_CHAN_INFO
         * Un client souhaite obtenir des information sur un canal.
         * le client fournit l'identifiant, le serveur renvoie par une structure décrivant le canal
         * un coupe circuit intervient pour toute connexion non identifiée
         * @param id {string} identifiant du canal
         * @param ack {function}
         */
        socket.on('REQ_MS_CHAN_INFO', ({id}, ack) => {
            if (client.id) {
                let oTxatUser = this.txat.findUser(client.id);
                let oChannel = this.txat.findChannel(id);
                if (oChannel.userPresent(oTxatUser)) {
                    ack({
                        id: oChannel.id(),
                        name: oChannel.name(),
                        type: oChannel.type(),
                        users: oChannel.users().map(u => ({
                            id: u.id,
                            name: u.name
                        }))
                    })
                } else {
                    ack(null);
                }
            } else {
                socket.close();
            }
        });



        /**
         * ### REQ_USER_INFO
         * Un client souhaite obtenir des informations sur un utilisateur.
         * le client fournit l'identifiant, le serveur renvoie par une structure décrivant l'utilisateur
         * si l'identifiant ne correspind à rien, kick
         * @param id {string} identifiant du user
         * @param ack
         */
        socket.on('REQ_MS_USER_INFO', ({id}, ack) => {
            if (client.id) {
                let oTxatUser = this.txat.findUser(id);
                if (oTxatUser) {
                    ack({
                        id: oTxatUser.id(),
                        name: oTxatUser.name()
                    })
                } else {
                    ack(null);
                }
            } else {
                socket.close();
            }
        });


        /**
         * ### MS_SAY
         * un utilisateur envoie un message de discussion
         * @param channel {string} identifiant du canal
         * @param message {string} contenu du message
         */
        socket.on('MS_SAY', ({channel, message}) => {
            if (client.id) {
                let oUser = this.txat.findUser(client.id);
                let oChannel = this.txat.findChannel(channel);
                if (oChannel.userPresent(oUser)) {
                    logger.logfmt(STRINGS.service.event.user_said,
                        channel,
                        client.name,
                        client.id,
                        message
                    );
                    oChannel.transmitMessage(oUser, message);
                } else {
                    logger.errfmt(STRINGS.service.error.invalid_channel, client.id, channel);
                }
            } else {
                socket.close();
            }
        });
    }




    /**
     * Avertir un client qu'il rejoin sur un canal
     * @param client {string} identifiant du client à prévenir
     * @param channel {string} information du canal concerné {id, name, type}
     */
    send_ms_you_join(client, channel) {
        let oChannel = this.txat.findChannel(channel);
        this._socket.emit(client, 'MS_YOU_JOIN', {
            id: oChannel.id(),
            name: oChannel.name(),
            type: oChannel.type()
        });
    }

    /**
     * avertir un client de l'arrivée d'un utilisateur sur un canal
     * @param client {string} identifiant du client à prévenir
     * @param user {string} identifiant du client arrivant
     * @param channel {string} identifiant du canal concerné
     */
    send_ms_user_joins(client, user, channel) {
        let oChannel = this.txat.findChannel(channel);
        let oClient = this.txat.findUser(client);
        if (oChannel.userPresent(oClient)) {
            // le client appartient au canal
            this._socket.emit(client, 'MS_USER_JOINS', {user, channel});
        }
    }

    /**
     * Avertir un client du départ d'un autre client d'un canal
     * @param client {string} identifiant du client à prévenir
     * @param user {string} identifiant du client partant
     * @param channel {string} identifiant du canal concerné
     */
    send_ms_user_leaves(client, user, channel) {
        this._socket.emit(client, 'MS_USER_LEAVES', {user, channel});
    }

    /**
     * Transmettre le message d'un client à un autre
     * @param client {string} identifiant du client destinataire
     * @param user {string} identifiant du client expéditeur
     * @param channel {string} identifiant du canal concerné / null si c'est un message privé
     * @param message {string} contenu du message
     */
    send_ms_user_says(client, user, channel, message) {
        this._socket.emit(client, 'MS_USER_SAYS', {user, channel, message});
    }
}


module.exports = ServiceTxat;