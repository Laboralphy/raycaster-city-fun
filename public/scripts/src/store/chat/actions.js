import * as types from './mutation-types';

const actions = {
    [types.CHAT_SHOW]: function({commit}) {
        commit(types.CHAT_SHOW);
    },
    [types.CHAT_HIDE]: function({commit}) {
        commit(types.CHAT_HIDE);
    },
    [types.CHAT_RESET]: function({commit}) {
		commit(types.CHAT_RESET);
    },
    [types.CHAT_ADD_TAB]: function({commit}, {id, caption}) {
        commit(types.CHAT_ADD_TAB, {id, caption});
    },
    [types.CHAT_SELECT_TAB]: function({commit}, {id}) {
        commit(types.CHAT_SELECT_TAB, {id});
    },
    [types.CHAT_POST_LINE]: function({commit}, {tab, client, message}) {
        commit(types.CHAT_POST_LINE, {tab, client, message});
    }
};

export default actions;