/**
 * Une zone du jeu:
 * Les instances de cette classe contient toutes les données de la zone
 * ainsi qu'une version exportable au format raycaster
 */
const RC_CONST = require('../consts/raycaster');

const Door = require('./Door');

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
        this.physicMap.forEach(row => row.forEach(cell => {
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
                cell.door = oDoor;
                this.doorList.push(oDoor);
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