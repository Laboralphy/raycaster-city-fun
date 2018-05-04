const Player = require('./Player');
const Mobile = require('./Mobile');
const Area = require('./Area');
const Emitter = require('events');
const ResourceLoader = require('../resource-loader/index');
const logger = require('../logger/index');
const o876 = require('../o876/index');
const Vector = o876.geometry.Vector;
const TangibleThinker = require('./thinkers/TangibleThinker');
const MissileThinker = require('./thinkers/MissileThinker');
const uniqid = require('uniqid');


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

        this.emitter = new Emitter();
        this._resourceLoader = new ResourceLoader();
    }

// #####   #####    ####   #    #     #    ######   ####
// #    #  #    #  #    #   #  #      #    #       #
// #    #  #    #  #    #    ##       #    #####    ####
// #####   #####   #    #    ##       #    #            #
// #       #   #   #    #   #  #      #    #       #    #
// #       #    #   ####   #    #     #    ######   ####

	on(...args) {
    	this.emitter.on(...args);
	}


    /**
	 * Renvoie le type de mobile parmis ceux des constante MOBILE_TYPE_*
     * @param mobile
     * @return {*}
     */
	static getMobileType(mobile) {
    	return mobile.data.type;
	}

    /**
	 * Renvoie les coordonnées (sous forme de vecteur) d'un mobile
     * @param mobile
     * @return {module.Vector|*}
     */
	static getMobileLocation(mobile) {
		return new mobile.location;
	}

    static getLocationPosition(location) {
        return location.position();
    }

    static getLocationArea(location) {
        return location.area();
    }

    static getAreaName(area) {
		return area.name;
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
	 * @returns {ResourceLoader}
	 */
	getDataManager() {
    	return this._resourceLoader;
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
		let level = await this._resourceLoader.loadLevel(id);
		area.data(level);
		logger.logfmt(STRINGS.game.level_built, id);
		this.emitter.emit('area.built', {area});
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
		let destroyTheseMobiles = {};
		for (let id in mobiles) {
			let m = mobiles[id];
			m.think();
			let area = m.location.area().id;
			if (m.thinker().hasChangedMovement()) {
				if (!m.isDead()) {
					if (!(area in updateTheseMobiles)) {
						updateTheseMobiles[area] = [];
					}
					updateTheseMobiles[area].push(m);
				}
			}
			if (m.isDead()) {
				if (!(area in destroyTheseMobiles)) {
					destroyTheseMobiles[area] = [];
				}
				destroyTheseMobiles[area].push(m);
			}
		}
		// tous les mobiles qui modifie l'uniformité de leur mouvement doivent donner lieu
		// a un message transmis aux joueurs de la zone
		return {
			// mobile update
			mu: this.transmitMobileMovement(updateTheseMobiles),
			md: this.transmitMobileMovement(destroyTheseMobiles)
		}
	}



// #    #  #    #   #####    ##     #####  ######  #####    ####
// ##  ##  #    #     #     #  #      #    #       #    #  #
// # ## #  #    #     #    #    #     #    #####   #    #   ####
// #    #  #    #     #    ######     #    #       #####        #
// #    #  #    #     #    #    #     #    #       #   #   #    #
// #    #   ####      #    #    #     #    ######  #    #   ####


	/**
	 * Supprime les mobiles qui ont l'état "dead"
	 */
	removeDeadMobiles() {
		for (let id in this._mobiles) {
			if (this._mobiles[id].isDead()) {
				this.destroyMobile(id);
			}
		}
	}

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
	 * - type : 'missile' ; 'player' ; 'mobile' ; 'vfx'
     * @return {Mobile}
	 */
	createMobile(id, ref, location, extra) {
		if (!extra) {
			extra = {};
		}
        let m = new Mobile();
        this._mobiles[id] = m;
        m.id = id;
        m.location.assign(location);
        m.blueprint = ref;

        // il faut merger les data contenu dans blueprints
		let oBlueprint = this._resourceLoader.loadResourceSync('b', ref);
		m.data = Object.assign({}, oBlueprint, extra);
        let area = m.location.area();
        let players = this.getAreaPlayers(area).map(p => p.id);

        // initialiser l'inertie (si jamais on doit transmettre une vitesse initiale
		let angle = m.location.heading();
		if (!('speed' in m.data)) {
			throw new Error('no initial speed defined for mobile #', id);
		}
		let fInitialSpeed = m.data.speed;
		let vInertia = o876.geometry.Helper.polar2rect(angle, fInitialSpeed);
		m.inertia().set(vInertia.dx, vInertia.dy);

        this.emitter.emit('mobile.created', { players, mobile: m });
        return m;
    }


    /**
     * Génère un missile
     * @param ref
     * @param oOwner
     * @param data
     * - speed : vitesse du missile
     */
    spawnMissile(ref, oOwner, data) {
        let location = oOwner.location;
        let idMissile = uniqid();
        data.type = RC.mobile_type_missile;
        let oMissile = this.createMobile(idMissile, ref, location, data);
        // il faut donner de la vitesse au missile ; c'est important pour que le client anime correctement le missile
        let th = new MissileThinker();
        th.mobile(oMissile);
        th.owner = oOwner;
        oMissile.thinker(th);
        oMissile.flagCrash = true;
        let angle = location.heading();
        let v = o876.geometry.Helper.polar2rect(angle, oMissile.data.speed);
        th.setMovement({a: angle, sx: v.dx, sy: v.dy});
        return oMissile;
    }


    destroyMobile(id) {
		let mobile = this._mobiles[id];
		if (mobile) {
			let area = mobile.location.area();
			let players = this.getAreaPlayers(area).map(p => p.id);
			mobile.finalize();
			this.emitter.emit('mobile.destroyed', { players, mobile });
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
		let mobile = this._mobiles[idm];
		let loc = mobile.location;
		loc.heading(a);
		mobile.thinker().setMovement({t, a, x, y, sx, sy, id, c});
		if (c) {
			// les command sont envoyée en tant qu'évènement
			// décomposer...
			for (let i = 1; i <= COMMANDS.LAST_COMMAND; i <<= 1) {
				if (c & i) {
                    this.emitter.emit('mobile.command', {mobile, command: i});
				}
			}
		}
		let pos = loc.position();
		let spd = mobile.inertia();
		return {
			a: loc.heading(),
			x: pos.x,
			y: pos.y,
			sx: spd.x,
			sy: spd.y,
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
			let playerData = await this._resourceLoader.loadClientData(client.name);
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
				type: RC.mobile_type_player,
			}
		);
        let oThinker = new TangibleThinker();
		oThinker.game(this);
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