import * as types from './mutation-types';

const mutations = {

    /**
     * Rend la fenetre de login visible
     * @param state
     */
    [types.UI_SHOW]: function (state) {
        state.visible = true;
    },

    /**
     * Rend la fenetre de login invisible
     * @param state
     */
    [types.UI_HIDE]: function (state) {
        state.visible = false;
    }
};

export default mutations;