import * as types from './mutation-types';

const actions = {
    [types.GAME_MENU_OPEN]: function ({commit}) {
        commit(types.GAME_MENU_OPEN);
    },
    [types.GAME_MENU_CLOSE]: function ({commit}) {
        commit(types.GAME_MENU_CLOSE);
    }
};

export default actions