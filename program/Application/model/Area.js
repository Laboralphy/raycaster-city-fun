/**
 * Une zone du jeu:
 * Les instances de cette classe contient toutes les données de la zone
 * ainsi qu'une version exportable au format raycaster
 */
const RC_CONST = require('../consts/raycaster');

const Door = require('./Door');
const ActiveList = require('./ActiveList');

class Area {
    constructor() {
        // nom eventuel de la zone
        this.name = '';
        // graine de génération aléatoire
        this.seed = '';
        // données initiale de la zone telle que générées par le générateur ou le level builder
        this.data = null;
        // carte des sections solid afin d'accelérer le calcul des collision murale
        this.physicMap = null;
        // liste des portes, afin de surveiller si on peut les traverser ou pas
        this.doorList = [];
        // liste des portes actives (celle qui sont en cours d'ouverture/refermeture
        this.activeDoorList = new ActiveList(); /** @todo ne gérer que les portes qui sont dans cette liste */
    }

	/**
     * Commande l'ouverture d'une porte en x, y
     * Si c'est un passage secret cela commandera aussi l'ouverture du block adjacent
	 * @param x
	 * @param y
	 */
	openDoor(x, y) {
        let oDoor = this.physicMap[y][x].door;
        if (oDoor) {
            if (oDoor.open()) {
				if (oDoor.isSecret()) {
					oDoor.nextSecretDoor = this.doorList.find(d => d.isSecret() && d.isAdjacent(oDoor));
				}
            }
        }
    }

	/**
     * Gestion des porte actuellement ouvertes ou entrouvertes
	 */
	processDoors() {
	    let aDoneDoors = this.activeDoorList.items.filter(door => door.process());
		this.activeDoorList.unlink(aDoneDoors);
    }

    /**
     * Fabrique la carte des zones solides
     */
    solidify() {
        this.physicMap = data.map.map(row => row.map(cell => {
            return {
                code: (cell & 0x0000F000) >> 12,
                door: null
            };
        }));
        this.physicMap.forEach((row, y) => row.forEach((cell, x) => {
            let oDoor = null;
            switch (cell.code) {
                case RC_CONST.phys_curt_sliding_down:
                case RC_CONST.phys_curt_sliding_up:
                case RC_CONST.phys_door_sliding_down:
                case RC_CONST.phys_door_sliding_up:
                    oDoor = new Door();
                    oDoor.setDoorType('v');
                    break;

                case RC_CONST.phys_door_sliding_left:
                case RC_CONST.phys_door_sliding_right:
                    oDoor = new Door();
                    oDoor.setDoorType('h1');
                    break;

                case RC_CONST.phys_door_sliding_double:
                    oDoor = new Door();
                    oDoor.setDoorType('h2');
                    break;

                case RC_CONST.phys_secret_block:
                    oDoor = new Door();
                    oDoor.setDoorType('s');
                    break;
            }
            if (oDoor) {
                // pour les porte, on complete l'instance
				oDoor.x = x;
				oDoor.y = y;
                cell.door = oDoor;
                this.doorList.push(oDoor);
				oDoor.events.on('opening', door => {
					this.activeDoorList.link(door);
				});
            }
        }));
    }

    /**
     * Renvoie true si le block spécifié est solide
     * c'est à dire que personne ne peut le traverser
     * cette methode prend en compte les porte et leur état
     */
    isSolid(x, y) {
        let pm = this.physicMap[y][x];
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
}