const getters = {
    /**
     * Renvoie ce qu'il faut afficher dans la fenetre de discussion
     */
    chatContent: function(state) {
        return function() {
            return state.activeTab ? state.activeTab.lines : [];
        };
    },


    getTab: function(state) {
        return function(id) {
            return state.tabs.find(t => t.id === id);
        };
    },
};

export default getters;