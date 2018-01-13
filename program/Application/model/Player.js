/**
 * classe de gestion d'un joueur
 *
 */

class Player {
    constructor() {
        // référence de la zone
        this.area = null;
        // position & angle dans cette zone
        this.position = {
            x: 0,
            y: 0,
            angle: 0
        };
        // instance de l'inventaire
        this.inventory = null;
    }
}