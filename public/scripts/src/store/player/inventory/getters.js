const actions = {
    /**
     * Récupère les items équipés du joueur
     * @param state
     */
    getEquipement: function({inventaire}) {
        const equipement = { // Les empalcements disponibles pour le stuff
            tete:   null,
            torse:  null,
            jambes: null,
            pieds: null,
            mainDroite: null,
            mainGauche: null
        };
        for(let k in inventaire) {
            if (inventaire[k].emplacement) {
                equipement[inventaire[k].emplacement] = inventaire[k];
            }
        }
        return equipement;
    }
};

export default actions;