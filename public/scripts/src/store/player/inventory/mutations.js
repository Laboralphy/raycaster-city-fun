import * as types from './types';
const mutations = {
    
    /**
     * Équipe le player d'un item
     * @param context
     * @param {Object} oItem informations sur l'équipement de l'item
     */
    [types.PLAYER_INVENTORY_EQUIPER]: function({inventaire}, infoEquipement) {
        // on équipe l'item
        inventaire.forEach((item) => {
            if (item.emplacement === infoEquipement.emplacement) {
                item.emplacement = null;
            }
            if (item.id === infoEquipement.idItem) {
                console.log('item équipé:', item)
                item.emplacement = infoEquipement.emplacement;
            }
        });
    },

    /**
     * Ranger un item
     * @param context
     * @param {Object} oItem informations sur l'équipement de l'item
     */
    [types.PLAYER_INVENTORY_RANGER]: function({inventaire}, infoRangement) {
        inventaire.forEach((item) => {
            if (item.id === infoRangement.idItem) {
                item.emplacement = null;
            }
        });
    },

    /**
     * Ranger un item
     * @param context
     * @param {Object} oItem informations sur l'équipement de l'item
     */
    [types.PLAYER_INVENTORY_UPDATE]: function(state, newInventaire) {
        state.inventaire = newInventaire;
    }
};

export default mutations;