/**
 * classe de gestion d'un joueur
 *
 */

const Location = require('./Location');

const PLAYER_STATUS = require('../consts/playerStatus');

class Player {
    constructor() {
        // identifiant
        this.id = '';
        // status :
        this.status = PLAYER_STATUS.UNIDENTIFIED;
        // aspect / type
        this.type = 'none';
        // position & angle dans cette zone
        this.location = new Location();
        // instance de l'inventaire
        this.inventory = null;

        // cette instance à été créée suite à la connexionb d'un client
        // il va falloir renseigner à ce client la situation complete du joueur

    }
}

module.exports = Player;