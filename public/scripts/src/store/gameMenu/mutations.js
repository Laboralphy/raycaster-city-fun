import * as types from './mutation-types';

const mutations = {
    /**
     * Ouvre le menu
     * @param state
     */
    [types.GAME_MENU_OPEN]: function(state) {
        state.isOpen = true;
        window.dispatchEvent(new Event('resize'));
    },

    /**
     * Ferme le menu
     * @param state
     */
    [types.GAME_MENU_CLOSE]: function(state) {
        state.isOpen = false;
    },
    /**
     * Toggle le menu
     * @param state
     */
    [types.GAME_MENU_TOGGLE]: function(state) {
        state.isOpen = !state.isOpen;
        window.dispatchEvent(new Event('resize'));
    },
};

export default mutations;