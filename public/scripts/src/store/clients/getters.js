const getters = {

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
        return function() {
            return state.localClient;
        }
    }
};

export default getters;