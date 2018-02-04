const Player = require('./Player');
const Level = require('./Level');
const Area = require('../Area');


/**
 * Cette classe gère les différent use cases issu du réseau ou de tout autre évènements
 */
class CentralProcessor {
    constrcutor() {
        this._areas = {};
        this._players = {};
        this._mobiles = {};
    }

    /**
     * Renvoie une instance d'Area
     * @param id
     * @return Area
     */
    async getArea(id) {
        if (id in this._areas) {
            return this._areas[id];
        } else {
            let area = new Area();
            // chargement des données
            area.data(await Level.load(id));
            this._areas[id] = area;
        }
    }

    transmit(player, event, packet) {
        let id = player.id;
    }

    /**
     * Fabrique un packet de creation de mobile
     * @param m
     * @return {{id, x, y, a: number, sx: number, sy: number, bp: module.Level.blueprint|string}}
     */
    static buildMobileCreationPacket(m) {
        let mloc = m.location();
        let mpos = mloc.position();
        let mspd = m.speed;
        return {
            id: m.id,
            x: mpos.x,
            y: mpos.y,
            a: mloc.heading(),
            sx: mspd.x,
            sy: mspd.y,
            bp: m.blueprint
        };
    }

    /**
     * Fabrique un packet de mise à jour de mobile
     * @param m
     * @return {{id, x, y, a: number, sx: number, sy: number}}
     */
    static buildMobileUpdatePacket(m) {
        let mloc = m.location();
        let mpos = mloc.position();
        let mspd = m.speed;
        return {
            id: m.id,
            x: mpos.x,
            y: mpos.y,
            a: mloc.heading(),
            sx: mspd.x,
            sy: mspd.y
        };
    }

    /**
     * Création d'une instance Player et d'une instance Mobile correspondant
     * @param id
     */
    createPlayer(id) {
        let p = new Player();
        p.id = id;
        this._players[id] = p;
        // obtenir et remplir la location
        // en cas d'absence de location, en créer une a partir de la position de départ du niveau
        let area = this.getArea(p.location.area());
        p.location.assign(area._startpoint); // @todo récupéré la position mise en persistance.
    }

    /**
     * ### use case Client Identified
     * un client s'est connecté et s'est identifié
     * il faut créer une instance et renseigner tous les joueur de la zone
     * de sa présence, et renseigner le joueur sur son état complet
     * @param id {string} identifiant du client
     */
    async clientIdentified(id) {
        // client identifié
        // creation player
        this.createPlayer(id);
        p = this._players[id];
        // recherche de son emplacement
        // p.location =...
        // transmettre la carte au client
        let area = await this.getArea(p.location.area);
        this.transmit(p, 'G_ENTER_LEVEL', {
            id: area.id,
            name: area.name,
            data: area.data(),
            doors: null, // @todo information permettant d'indiquer les portes ouvertes
        });
        this._players[id] = p;
    }

    /**
     * ### use case Client Has Loaded Level
     * le client a fini de charger son niveau
     * il faut lui transmettre l'état dynamique du niveau :
     * position de tous les mobiles
     * il faut transmettre aux autres client la position du nouveau
     */
    clientHasLoadedLevel(id) {
        let p = this._players[id];
        let oPlayerMobile = this._mobiles[id];
        let area = this._areas[p.location.area];

        // transmettre la position de tous les mobiles
        let aMobiles = Object
            .values(this._mobiles)
            .filter(px => px.location.area === area.id)
            .map(px => px.id);
        let aPackets = aMobiles.map(CentralProcessor.buildMobileCreationPacket);
        this.transmit(id, 'G_CREATE_MOBILES', aPackets);

        // transmettre aux clients la position du nouveau
        let aTonari = Object
            .values(this._players)
            .filter(px => px.location.area === area.id);
        this.transmit(aTonari, 'G_CREATE_MOBILE', CentralProcessor.buildMobileCreationPacket(oPlayerMobile));
    }
}