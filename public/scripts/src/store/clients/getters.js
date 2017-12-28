const getters = {

    /**
     * Renvoie les données concernant un client
     * si l'id est ignoré on renvoie le client local
     * @param id {number} identifiant du client
     */
    getClient: function(state) {
        return function(id) {
            return state.clients.find(c => c.id === id);
        };
    },

    getLocalClient: function(state) {
		return function(id) {
			return state.localClient;
		};
    }
};

export default getters;