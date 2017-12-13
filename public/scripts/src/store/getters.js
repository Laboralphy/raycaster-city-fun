const getters = {
    /**
     * Renvoie ce qu'il faut afficher dans la fenetre de discussion
     */
    chatContent: function(state) {
        return state.chat.activeTab ? state.chat.activeTab.lines : [];
    },


    getTab: function(state) {
        return function(id) {
            return state.chat.tabs.find(t => t.id === id);
        };
    },

    /**
     * Renvoie les données concernant un client
     * @param id {number} identifiant du client
     */
    client: function(state) {
        return function(id) {
            return state.clients.find(c => c.id === id);
        };
    },

    getLocalClient: function(state) {
        return state.localClient;
    }
};

export default getters;