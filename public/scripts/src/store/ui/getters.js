const getters = {

    /**
     * Renvoie true si le composant est visible
     * @param state
     * @return {boolean|*}
     */
    isVisible: function (state) {
        return state.visible;
    }
};

export default getters;