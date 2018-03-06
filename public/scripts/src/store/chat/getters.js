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

    getLastLine: function(state, getters) {
	    let lines = state.activeTab ? state.activeTab.lines : [];
	    let n = lines.length - 1;
	    if (n >= 0) {
            return lines[n];
        } else {
	        return null;
        }
    }
};

export default getters;