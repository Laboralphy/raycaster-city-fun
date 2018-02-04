/**
 * Une zone du jeu:
 * Les instances de cette classe contient toutes les données de la zone
 * ainsi qu'une version exportable au format raycaster
 */
const RC_CONST = require('../consts/raycaster');

const Door = require('./Door');
const ActiveList = require('./ActiveList');

module.exports = class Area {
    constructor() {
        // nom eventuel de la zone
        this._name = '';
        // graine de génération aléatoire
        this.seed = '';
        // données initiale de la zone telle que générées par le générateur ou le level builder
        this._data = null;
        // niveau
        this._level = null;
        // carte des sections solid afin d'accelérer le calcul des collision murale
        this._physicMap = null;
        // liste des portes, afin de surveiller si on peut les traverser ou pas
        this._doorList = [];
        // liste des portes actives (celle qui sont en cours d'ouverture/refermeture
        this._activeDoorList = new ActiveList(); /** @todo ne gérer que les portes qui sont dans cette liste */
        // position de départ
        this._startpoint = null;
    }

	/**
     * Commande l'ouverture d'une porte en x, y
     * Si c'est un passage secret cela commandera aussi l'ouverture du block adjacent
	 * @param x
	 * @param y
	 */
	openDoor(x, y) {
        let oDoor = this._physicMap[y][x].door;
        if (oDoor) {
            if (oDoor.open()) {
				if (oDoor.isSecret()) {
					oDoor.nextSecretDoor = this._doorList.find(d => d.isSecret() && d.isAdjacent(oDoor));
				}
            }
        }
    }

	/**
     * Gestion des porte actuellement ouvertes ou entrouvertes
	 */
	processDoors() {
	    let aDoneDoors = this._activeDoorList.items.filter(door => door.process());
		this._activeDoorList.unlink(aDoneDoors);
    }

    level(l) {
	    if (l === undefined) {
	        return this._level;
        } else {
	        this._level = l;
	        this.data(l.render());
        }
    }

    /**
     * Fabrique la carte des zones solides
     */
    data(d) {
        if (d === undefined) {
            return this._data;
        } else {
            this._data = d;
            this._physicMap = d.map.map(row => row.map(cell => {
                return {
                    code: (cell & 0x0000F000) >> 12,
                    door: null
                };
            }));
            this._physicMap.forEach((row, y) => row.forEach((cell, x) => {
                if (cell.code >= RC_CONST.phys_first_door && cell.code <= RC_CONST.phys_last_door) {
                    let oDoor = new Door();
                    oDoor.setDoorType(cell.code);
                    // pour les porte, on complete l'instance
                    oDoor.x = x;
                    oDoor.y = y;
                    cell.door = oDoor;
                    this._doorList.push(oDoor);
                    oDoor.events.on('opening', door => {
                        this._activeDoorList.link(door);
                    });
                }
            }));
            this._startpoint = d.startpoint;
            return this;
        }
    }

    /**
     * Renvoie true si le block spécifié est solide
     * c'est à dire que personne ne peut le traverser
     * cette methode prend en compte les porte et leur état
     */
    isSolid(x, y) {
        let pm = this._physicMap[y][x];
        switch (pm.code) {
            case RC_CONST.phys_none:
                return false;

            case RC_CONST.phys_wall:
            case RC_CONST.phys_secret_block:
            case RC_CONST.phys_transparent_block:
            case RC_CONST.phys_invisible_block:
            case RC_CONST.phys_offset_block:
                return true;

            default:
                return pm.door.isSolid();
        }
    }

    isSolidPoint(x, y) {
    	return this.isSolid(
    		x / RC_CONST.plane_spacing | 0,
			y / RC_CONST.plane_spacing | 0
		);
	}
};