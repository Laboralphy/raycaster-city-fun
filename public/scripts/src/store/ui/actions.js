import * as types from './mutation-types';

const actions = {
    [types.UI_SHOW]: function ({commit}) {
        commit(types.UI_SHOW);
    },
    [types.UI_HIDE]: function ({commit}) {
        commit(types.UI_HIDE);
    }
};

export default actions