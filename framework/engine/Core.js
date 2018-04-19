const Player = require('./Player');
const Mobile = require('./Mobile');
const Area = require('./Area');
const Emitter = require('events');
const DataManager = require('../resource-loader/index');
const logger = require('../logger/index');
const o876 = require('../o876/index');
const Vector = o876.geometry.Vector;
const MoverThinker = require('./thinkers/MoverThinker');

const STRINGS = require('../consts/strings');
const STATUS = require('../consts/status');
const COMMANDS = require('../consts/commands');
const RC = require('../consts/raycaster');

/**
 * Cette classe gère les différent use cases issu du réseau ou de tout autre évènements
 */
class Core {
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
	 * Renvoie l'instance du datamanger
	 * @returns {DataManager}
	 */
	getDataManager() {
    	return this._dataManager;
	}

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

    // // les transmitters permettre de transmettres des packet a desticnation des clients
	// /**
    //  * Transmission d'un packet à un joueur
	 // * @param player {Player} joueur a qui envoyer le packet
	 // * @param event {string} nom de l'évnèmenet
	 // * @param packet {*} contenu du packet
	 // */
	// transmit(player, event, packet) {
	 //    if (Array.isArray(player)) {
	 //        player.forEach(p => this.transmit(p, event, packet));
    //     } else {
    //         this.emitter.emit('transmit', player.id, event, packet);
    //     }
    // }

	/**
	 * Transmission du changement de mouvement d'un mobile
	 * @param mobileRegistryArea {array} assoc map -> list of mobile
	 * cet objet contient pour chaque area, la liste des mobile à updaté
	 * (ceux dont le mouvement a changé).
	 */
	transmitMobileMovement(mobileRegistryArea) {
		let aTransmit = [];
		for (let idArea in mobileRegistryArea) {
			let mobs = mobileRegistryArea[idArea];
			let a = this._areas[idArea];
			let p = this.getAreaPlayers(a);
			aTransmit.push({
				p,
				m: mobs.map(
					mobile => mobile.thinker().getMovement()
				).filter(mov => !!mov)
			});
		}
		return aTransmit;
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
	 * Construction d'une nouvelle zone
	 * @param id {string} identifiant de référence de la zone
	 */
	async buildArea(id) {
		logger.logfmt(STRINGS.game.building_level, id);
		let area = new Area();
		area.id = id;
		area.name = id;
		let level = await this._dataManager.loadLevel(id);
		area.data(level);
		logger.logfmt(STRINGS.game.level_built, id);
		return area;
	}




 // #####    ####    ####   #    #  #        ####    ####   #####
 // #    #  #    #  #    #  ##  ##  #       #    #  #    #  #    #
 // #    #  #    #  #    #  # ## #  #       #    #  #    #  #    #
 // #    #  #    #  #    #  #    #  #       #    #  #    #  #####
 // #    #  #    #  #    #  #    #  #       #    #  #    #  #
 // #####    ####    ####   #    #  ######   ####    ####   #


	/**
	 * renvoie la modification de l'état du jeu, afin de transmettre cela aux différents clients
	 * - modification des clients (position, angle, vitesse)
	 * - creation de mobiles
	 * - suppression de mobile
	 * - changement de l'état des portes
	 * - ...
	 */
	getStateMutations() {
		let mobiles = this._mobiles;
		let updateTheseMobiles = {};
		for (let id in mobiles) {
			let m = mobiles[id];
			m.think();
			if (m.thinker().hasChangedMovement()) {
				let area = m.location.area().id;
				if (!(area in updateTheseMobiles)) {
					updateTheseMobiles[area] = [];
				}
				updateTheseMobiles[area].push(m);
			}
		}
		// tous les mobiles qui modifie l'uniformité de leur mouvement doivent donner lieu
		// a un message transmis aux joueurs de la zone
		return {
			// mobile update
			mu: this.transmitMobileMovement(updateTheseMobiles)
		}
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
	 *
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
        // données du personnage
        p.character = playerData.character;
		return p;
    }

	/**
     * Création d'un mobile, cela peut etre un PNJ ou un missile
     * @param id {string} identifiant
     * @param ref {string} référence du blueprint
     * @param location {Location}
	 * @param extra {*}
	 * - speed: vitesse lors d'un mouvement (un missile est toujour en mouvement...)
	 * - type : 'missile' ; 'player' ; 'mob' ; 'vfx'
     * @return {Mobile}
	 */
	createMobile(id, ref, location, extra) {
        let m = new Mobile();
        m.id = id;
        m.location.assign(location);
        m.blueprint = ref;
        m.data = extra;
        this._mobiles[id] = m;
        let area = m.location.area();
        let players = this.getAreaPlayers(area).map(p => p.id);
        // en général ca va etre un service de socket qui va exploiter cet évènement
		switch (extra.type) {
			case 'missile':
				// pour les missiles, la vitesse spécifiée influence immédiatement le vecteur vitesse
				// tandis que pour les autres entité, la vitesse spécifiée n'est qu'une indication de la vitesse max
				m.speed.fromPolar(m.location.heading(), extra.speed);
				break;

			case 'player':
				break;

			case 'mobile':
				break;

			case 'vfx':
				break;

			default:
				throw new Error('this type of mobile is unknown (allowed values are "player", "missile", "mobile", "vfx", "static")');
		}
        this.emitter.emit('mobile.created', { players, mob: m });
        return m;
    }

    destroyMobile(id) {
		let mob = this._mobiles[id];
		if (mob) {
			let area = mob.location.area();
			let players = this.getAreaPlayers(area).map(p => p.id);
			mob.finalize();
			this.emitter.emit('mobile.destroyed', { players, mob });
		}
		delete this._mobiles[id];
	}

    /**
     * Ajoute un level à la liste des zones
     * @param id {string} identifiant de la zone
     * @param area {Area} instance de la zone
     */
    linkArea(id, area) {
	    this._areas[id] = area;
    }


	/**
	 * Rejoue les movement du client pour mise en conformité
	 * {id, lt, a, sx, sy, c}
	 * retransmet à tous les client de la zone la position de ce client
	 * quand le serveur recois un ensemble de paquets il faut les jouer
	 */
	playClientMovement(idm, {t, a, x, y, sx, sy, id, c}) {
		let mob = this._mobiles[idm];
		if (!mob) {
			console.error('mob', idm, 'does not exist');
		}
		let loc = mob.location;
		loc.heading(a);
		mob.thinker().setMovement({t, a, x, y, sx, sy, id, c});
		if (c) {
			// les command sont envoyée en tant qu'évènement
			// décomposer...
			for (let i = 1; i <= COMMANDS.LAST_COMMAND; i <<= 1) {
				if (c & i) {
                    this.emitter.emit('player.command', {mob, command: i});
				}
			}
		}
		return {
			a: loc.heading(),
			x: loc.position().x,
			y: loc.position().y,
			sx: mob.speed.x,
			sy: mob.speed.y,
			id: id
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
			logger.logfmt(STRINGS.game.player_created, id);
			this._players[id] = p;
        }
        let area = p.location.area();
        logger.logfmt(STRINGS.game.player_downloading_area, id, area.name);
        let live = null;
        return {area, live};
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

        // p.character contient des données spéciale gameplay


        // transmettre la position de tous les mobiles
        let mobiles = Object
            .values(this._mobiles)
            .filter(px => px.location.area() === area && px.id !== id);
        let subject = this.createMobile(
        	id,
			p.character.blueprint,
			p.location,
			{ // données supplémentaires
				type: 'player',
        		speed: p.character.speed
			}
		);
        let oThinker = new MoverThinker();
		subject.thinker(oThinker);
		oThinker.mobile(subject);

		// définir quelques variables


        // déterminer la liste des joueur présents dans la zone
		let players = this.getAreaPlayers(area).filter(p => p.id !== id).map(p => p.id);
        return {
        	subject,
			mobiles,
			players
		};
    }


	clientHasLeft(client) {
    	let id = client.id;
		this.destroyMobile(id);
		delete this._players[id];
	}
}

module.exports = Core;