const getters = {

    /**
     * Renvoie true si le composant est visible
     * @param state
     * @return {boolean|*}
     */
    isVisible: function (state) {
        return state.visible;
    },

	isVisibleChat: function(state) {
		return state.sections.chat.visible;
	},

	isVisibleLogin: function(state) {
		return state.sections.login.visible;
	}
};

export default getters;