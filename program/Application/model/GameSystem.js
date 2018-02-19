const Player = require('./Player');
const Mobile = require('./Mobile');
const Area = require('./Area');
const uniqid = require('uniqid');
const Emitter = require('events');
const DataManager = require('./DataManager');
const asyncfs = require('../../asyncfs');
const logger = require('../../Logger');
const o876 = require('../../o876');
const Vector = o876.geometry.Vector;

const STRINGS = require('../consts/strings');
const STATUS = require('../consts/status');

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
			area = await this.buildArea(id);
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
			.filter(px => px.location.area() === area);
    }

	/**
     * Renvoie la liste des joueurs qui sont dan sla zone
	 * @param area {Area}
	 */
	getAreaPlayers(area) {
		return Object
			.values(this._players)
			.filter(px => px.location.area() === area);
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
            s: mspd,
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
			s: mspd
        };
    }

	/**
	 * Construction d'une nouvelle zone
	 * @param id {string} identifiant de référence de la zone
	 */
	async buildArea(id) {
		logger.logfmt(STRINGS.service.game_events.building_level, id);
		let area = new Area();
		area.id = id;
		area.name = id;
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
     * Création d'une instance Player et chargement des données initiale
     * @param id
	 * @param playerData {object} données persistante du joueur
     */
    async createPlayer(id, playerData) {
		let location = playerData.location;
		let x = location.x;
		let y = location.y;
		let angle = location.angle;
		let area = await this.getArea(location.area);
        let p = new Player();
        p.id = id;
        p.status = STATUS.UNIDENTIFIED;
        this._players[id] = p;
        // obtenir et remplir la location
        // en cas d'absence de location, en créer une a partir de la position de départ du niveau
        p.location.position().set(x, y);
        p.location.heading(angle);
        p.location.area(area);
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
        //this.transmitToArea(location.area, 'G_CREATE_MOBILE', GameSystem.buildMobileCreationPacket(m));
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


    playClientAction(id, action) {

	}

	/**
	 * Rejoue les movement du client pour mise en conformité
	 */
	playClientMovement(id, packets) {
		let mob = this._mobiles[id];
		let vSpeed = new Vector();
		let loc = mob.location;
		let lastId = packets.reduce((prev, {t, a, x, y, sx, sy, id, c}) => {
			loc.heading(a);
			if (c) {
				this.playClientAction(id, c);
			}
			vSpeed.set(sx, sy);
			for (let i = 0; i < t; ++i) {
				mob.move(vSpeed);
			}
			return id;
		}, 0);
		// renvoyer au client les dernière information validée
		return {
			a: loc.heading(),
			x: loc.position().x,
			y: loc.position().y,
			sx: mob.speed.x,
			sy: mob.speed.y,
			id: lastId
		};
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
	 * Le client est pret à télécharger le niveau dans lequel il est sensé se rendre
	 * @param client
	 * @returns {Promise<void>}
	 */
	async clientWantsToLoadLevel(client) {
		// transmettre la carte au client
        let id = client.id;
        let p = this._players[id];
        if (!p) {
			let playerData = await this._dataManager.loadClientData(client.name);
			p = await this.createPlayer(id, playerData);
			logger.logfmt(STRINGS.service.game_events.player_created, id);
			this._players[id] = p;
        }
        let area = p.location.area();
        logger.logfmt(STRINGS.service.game_events.player_downloading_area, id, area.name);
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
    clientHasLoadedLevel(client) {
    	let id = client.id;
        let p = this._players[id];
        let area = p.location.area();

        // transmettre la position de tous les mobiles
        let mobiles = Object
            .values(this._mobiles)
            .filter(px => px.location.area() === area && px.id !== id)
            .map(px => GameSystem.buildMobileCreationPacket(px.id));
        let subject = this.createMobile(id, p.blueprint, p.location);
        // déterminer la liste des joueur présents dans la zone
		let players = this.getAreaPlayers(area).filter(p => p.id !== id).map(p => p.id);
        return {
        	subject,
			mobiles,
			players
		}
        // this.transmit(id, 'G_CREATE_MOBILES', aPackets);
        // transmettre aux clients la position du nouveau
    }


	/**
	 * Le mobile d'un client a mis à jour son mouvement
	 * @param a
	 * @param x
	 * @param y
	 * @param sx
	 * @param sy
	 */
    clientMobileUpdate(client, packets) {
		let id = client.id;
		let mob = this._mobiles[id];
		this.playClientMovement(client.id, packets);
		let pos = mob.location.position();
		this.transmit(this._players[id]);
	}


	clientHasLeft(client) {
    	let id = client.id;
    	let mob = this._mobiles[id];
    	// détruire ce mobile : mob
		if (mob) {
			mob.finalize();
		}
		delete this._mobiles[id];
		delete this._players[id];
	}
}

module.exports = GameSystem;