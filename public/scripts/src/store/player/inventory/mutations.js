import * as types from './types';

const mutations = {
    /**
     * Équipe le player d'un item
     * @param context
     * @param {Object} oItem informations sur l'équipement de l'item
     */
    [types.PLAYER_INVENTORY_EQUIPER]: function({inventaire}, infoEquipement) {
        for (let i in inventaire) {
            if (inventaire[i].emplacement === infoEquipement.emplacement) {
                inventaire[i].emplacement = null;
            }
        }
        inventaire[infoEquipement.idItem].emplacement = infoEquipement.emplacement;
    },
    // /**
    //  * Ranger un item
    //  * @param context
    //  * @param {Object} oItem informations sur l'équipement de l'item
    //  */
    // [types.PLAYER_INVENTORY_EQUIPER]: function({inventaire}, infoEquipement) {
    //     for (let i in inventaire) {
    //         if (inventaire[i].emplacement === infoEquipement.emplacement) {
    //             inventaire[i].emplacement = null;
    //         }
    //     }
    //     inventaire[infoEquipement.idItem].emplacement = infoEquipement.emplacement;
    // }
};

export default mutations;