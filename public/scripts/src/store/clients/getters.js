const getters = {

    /**
     * Renvoie true si le composant est visible
     * @param state
     * @return {boolean|*}
     */
    isVisible: function(state) {
        return state.visible;
    },

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
		return function() {
			return state.localClient;
		};
    }
};

export default getters;