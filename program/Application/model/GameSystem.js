const Player = require('./Player');
const Mobile = require('./Mobile');
const Area = require('./Area');
const uniqid = require('uniqid');
const Emitter = require('events');
const DataManager = require('./DataManager');
const asyncfs = require('../../asyncfs');
const logger = require('../../Logger');
const STRINGS = require('../consts/strings');

/**
 * Cette classe gère les différent use cases issu du réseau ou de tout autre évènements
 */
class GameSystem {
    constructor() {
        this._areas = {};
        this._players = {};
        this._mobiles = {};
        this._blueprints = {};

        this.emitter = new Emitter();
        this._dataManager = new DataManager();
    }

//  ####   ######   #####   #####  ######  #####    ####
// #    #  #          #       #    #       #    #  #
// #       #####      #       #    #####   #    #   ####
// #  ###  #          #       #    #       #####        #
// #    #  #          #       #    #       #   #   #    #
//  ####   ######     #       #    ######  #    #   ####


    // Les getters permettent d'interoger l'état du jeu


    /**
     * Renvoie une instance d'Area
     * @param id
     * @return Area
     */
    async getArea(id) {
		let area;
		if (id in this._areas) {
			area = this._areas[id];
		} else {
			area = this.buildArea(id);
			this.linkArea(id, area);
		}
		return area;
    }

	/**
     * Renvoie la liste des mobiles qui sont dans la zone spécifiée
     * @param area {Area} zone dans laquelle s'effectue la recherche
     * @return {Array.<Mobile>}
	 */
	getAreaMobiles(area) {
		return Object
			.values(this._mobiles)
			.filter(px => px.location.area === area);
    }

	/**
     * Renvoie la liste des joueurs qui sont dan sla zone
	 * @param area
	 */
	getAreaPlayers(area) {
		return Object
			.values(this._players)
			.filter(px => px.location.area === area);
    }









//  #####  #####     ##    #    #   ####   #    #     #     #####  #####    ####
//    #    #    #   #  #   ##   #  #       ##  ##     #       #    #    #  #
//    #    #    #  #    #  # #  #   ####   # ## #     #       #    #    #   ####
//    #    #####   ######  #  # #       #  #    #     #       #    #####        #
//    #    #   #   #    #  #   ##  #    #  #    #     #       #    #   #   #    #
//    #    #    #  #    #  #    #   ####   #    #     #       #    #    #   ####

    // les transmitters permettre de transmettres des packet a desticnation des clients
	/**
     * Transmission d'un packet à un joueur
	 * @param player {Player} joueur a qui envoyer le packet
	 * @param event {string} nom de l'évnèmenet
	 * @param packet {*} contenu du packet
	 */
	transmit(player, event, packet) {
	    if (Array.isArray(player)) {
	        player.forEach(p => this.transmit(p, event, packet));
        } else {
            this.emitter.emit('transmit', player.id, event, packet);
        }
    }

	/**
     * Transmission d'un packet à tous les joueur d'une zone
	 * @param area {Area} zone
	 * @param event {string} nom de l'évnèmenet
	 * @param packet {*} contenu du packet
	 */
	transmitToArea(area, event, packet) {
        this.transmit(this.getAreaPlayers(area), event, packet);
    }




// #    #  ######  #       #####   ######  #####    ####
// #    #  #       #       #    #  #       #    #  #
// ######  #####   #       #    #  #####   #    #   ####
// #    #  #       #       #####   #       #####        #
// #    #  #       #       #       #       #   #   #    #
// #    #  ######  ######  #       ######  #    #   ####

    // Les helpers aide à faires différent truc
    // les builder aident à fabriquer les paquet de données à partir d'entité


    /**
     * Fabrique un packet de creation de mobile
     * @param m
     * @return {{id, x, y, a: number, sx: number, sy: number, bp: module.Level.blueprint|string}}
     */
    static buildMobileCreationPacket(m) {
        let mloc = m.location;
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
	 * Construction d'une nouvelle zone
	 * @param id {string} identifiant de référence de la zone
	 */
	async buildArea(id) {
		logger.logfmt(STRINGS.service.game_events.building_level, id);
		let area = new Area();
		let level = await this._dataManager.loadLevel(id);
		area.data(level);
		logger.logfmt(STRINGS.service.game_events.level_built, id);
		return area;
	}






// #    #  #    #   #####    ##     #####  ######  #####    ####
// ##  ##  #    #     #     #  #      #    #       #    #  #
// # ## #  #    #     #    #    #     #    #####   #    #   ####
// #    #  #    #     #    ######     #    #       #####        #
// #    #  #    #     #    #    #     #    #       #   #   #    #
// #    #   ####      #    #    #     #    ######  #    #   ####

    // Les mutateurs permettent de modifier l'etat du jeu

    /**
     * Création d'une instance Player et d'une instance Mobile correspondant
     * @param id
     */
    async createPlayer(id, {x, y, angle, area}) {
        let p = new Player();
        p.id = id;
        this._players[id] = p;
        // obtenir et remplir la location
        // en cas d'absence de location, en créer une a partir de la position de départ du niveau
        p.location.x = x;
        p.location.y = y;
        p.location.heading(angle);
        p.location.area(area);
		//this.createMobile(id, p.type, p.location);
		return p;
    }

	/**
     * Création d'un mobile, cela peut etre un PNJ ou un missile
     * @param id {string} identifiant
     * @param ref {string} référence du blueprint
     * @param location {Location}
     * @return {Mobile}
	 */
	createMobile(id, ref, location) {
        let m = new Mobile();
        m.id = id;
        m.location.assign(location);
        m.blueprint = ref;
        this._mobiles[id] = m;
        this.transmitToArea(location.area, 'G_CREATE_MOBILE', GameSystem.buildMobileCreationPacket(m));
        return m;
    }

    /**
     * Ajoute un level à la liste des zones
     * @param id {string} identifiant de la zone
     * @param area {Area} instance de la zone
     */
    linkArea(id, area) {
	    this._areas[id] = area;
    }



// #    #   ####   ######           ####     ##     ####   ######   ####
// #    #  #       #               #    #   #  #   #       #       #
// #    #   ####   #####           #       #    #   ####   #####    ####
// #    #       #  #               #       ######       #  #            #
// #    #  #    #  #               #    #  #    #  #    #  #       #    #
//  ####    ####   ######           ####   #    #   ####   ######   ####

    // fonction appelée par les services pour indiquer des cas d'utilisation
    // généralement des action du client

    /**
     * ### use case Client Identified
     * un client s'est connecté et s'est identifié
     * il faut créer une instance et renseigner tous les joueur de la zone
     * de sa présence, et renseigner le joueur sur son état complet
     * @param id {string} identifiant du client
     * @param sSymbolicId {string}
     */
    async clientIdentified(client) {
		let id = client.id;
		logger.logfmt(STRINGS.service.game_events.player_auth, id);
		// client identifié
		// recherche de son emplacement
		let playerData = await this._dataManager.loadClientData(client.name);
		logger.logfmt(STRINGS.service.game_events.player_data_loaded, id);
		// creation player


		let p = await this.createPlayer(id, playerData.location);
		logger.logfmt(STRINGS.service.game_events.player_created, id);
		this._players[id] = p;
    }

	/**
	 * Le client est pret à télécharger le niveau dans lequel il est sensé se rendre
	 * @param client
	 * @returns {Promise<void>}
	 */
	async clientWantsToLoadLevel(client) {
		// transmettre la carte au client
        let id = client.id;
        let p = this._players[id];
        if (!p) {
            throw new Error('player ' + id + ' has not been instanciated');
        }
        let area = await this.getArea(p.location.area());
        logger.logfmt(STRINGS.service.game_events.player_downloading_area, id, p.location.area());
        let doors = null;
        return {area, doors};
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
        let area = this._areas[p.location.area];

        // transmettre la position de tous les mobiles
        let aMobiles = Object
            .values(this._mobiles)
            .filter(px => px.location.area === area.id)
            .map(px => px.id);
        let aPackets = aMobiles.map(GameSystem.buildMobileCreationPacket);
        this.transmit(id, 'G_CREATE_MOBILES', aPackets);

        // transmettre aux clients la position du nouveau
    }
}

module.exports = GameSystem;