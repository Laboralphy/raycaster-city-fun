const getters = {

    /**
     * Renvoie ce qu'il faut afficher dans la fenetre de discussion actuellement sélectionnée
     */
    getContent: function(state) {
		return state.activeTab ? state.activeTab.lines : ['d'];
    },

    getActiveTab: function(state) {
        return state.activeTab;
    },

	/**
     * Renvoie l'onglet actuellement actif
	 * @param state
	 * @returns {Function}
	 */
	getTab: function(state) {
        return function(id) {
            return state.tabs.find(t => t.id === id);
        };
    },
};

export default getters;