import * as types from './types';

const actions = {
    /**
     * Équipe le player d'un item
     * @param context
     * @param {Object} oItem informations sur l'équipement de l'item
     */
    [types.PLAYER_INVENTORY_EQUIPER]: function(context, infoEquipement) {
        // @todo: Message webSocket
        context.commit(types.PLAYER_INVENTORY_EQUIPER, infoEquipement);
    }
};

export default actions;