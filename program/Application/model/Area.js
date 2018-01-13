/**
 * Une zone du jeu:
 * Les instances de cette classe contient toutes les données de la zone
 * ainsi qu'une version exportable au format raycaster
 */

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
        this.doorList = null;
    }

    /**
     * Fabrique la carte des zones solides
     */
    solidify() {
        this.physicMap = data.map.map(row => row.map(cell => {
            return (cell & 0x0000F000) >> 12;
        }));
    }

    /**
     * Renvoie true si le block spécifié est solide
     * c'est à dire que personne ne peut le traverser
     * cette methode prend en compte les porte et leur état
     */
    isSolid() {

    }
}