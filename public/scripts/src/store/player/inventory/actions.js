import * as types from './types';

const actions = {
    /**
     * Équipe le player d'un item
     * @param context
     * @param {Object} infoEquipement informations sur l'équipement de l'item
     */
    [types.PLAYER_INVENTORY_EQUIPER]: function(context, infoEquipement) {
        // @todo: Message webSocket
        const target = context.state.inventaire.find((i) => infoEquipement.idItem === i.id);
        if (!target) return;
        infoEquipement.emplacement = infoEquipement.emplacement || target.equipable[0];
        if (target.equipable.indexOf(infoEquipement.emplacement) !== -1) {
            context.commit(types.PLAYER_INVENTORY_EQUIPER, infoEquipement);
        }
    },
    /**
     * Équipe le player d'un item
     * @param context
     * @param {Object} infoEquipement informations sur l'équipement de l'item
     */
    [types.PLAYER_INVENTORY_RANGER]: function(context, infoEquipement) {
        // @todo: Message webSocket
        context.commit(types.PLAYER_INVENTORY_RANGER, infoEquipement);
    },
    /**
     * Réorganise l'inventaire
     * @param context
     * @param {Array} newInventaire : le nouvel inventaire réoganisé
     */
    [types.PLAYER_INVENTORY_UPDATE]: function(context, newInventaire) {
        context.commit(types.PLAYER_INVENTORY_UPDATE, newInventaire);
    }
};

export default actions;