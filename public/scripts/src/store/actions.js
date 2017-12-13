import * as types from './mutation-types';

const actions = {
    [types.CHAT_ADD_TAB]: function({commit}, {id, caption}) {
        commit(types.CHAT_ADD_TAB, {id, caption});
    },
    [types.CHAT_SELECT_TAB]: function({commit}, {id}) {
        commit(types.CHAT_SELECT_TAB, {id});
    },
    [types.CHAT_POST_LINE]: function({commit}, {tab, client, message}) {
        commit(types.CHAT_POST_LINE, {tab, client, message});
    },
    [types.CLIENT_CONNECT]: function({commit}, {id, name}) {
        commit(types.CLIENT_CONNECT, {id, name});
    },
    [types.CLIENT_DISCONNECT]: function({commit}, {id}) {
        commit(types.CLIENT_DISCONNECT, {id});
    },
    [types.CLIENT_SET_LOCAL]: function({commit}, {id}) {
        commit(types.CLIENT_SET_LOCAL, {id});
    },

};

export default actions;