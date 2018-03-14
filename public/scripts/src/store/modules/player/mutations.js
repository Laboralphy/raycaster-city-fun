import * as types from './mutation-types';

const mutations = {
    /**
     * Déinit globalement le nom du joueur
     * @param state
     * @param name Le nom du joueur
     */
    [types.PLAYER_SET_NAME]: function(state, name) {
        state.name = name;
    }
};

export default mutations;