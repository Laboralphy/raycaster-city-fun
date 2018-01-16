import {CONST} from '../../../data/const';

const actions = {
    /**
     * Récupère les items équipés du joueur
     * @param state
     */
    getEquipement: function({inventaire}) {
        const mapping = CONST.ITEMS.SLOTS.map((s) => {
            return {
                emplacement: s,
                item: inventaire.find((i) => {
                    return i.emplacement === s;
                })
            }
        });
        // console.log(mapping);
        return mapping;
    }
};

export default actions;