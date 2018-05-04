import * as types from './mutation-types';

const actions = {
    [types.RESET]: function({commit}) {
		commit(types.RESET);
    },
    [types.ADD_TAB]: function({commit}, {id, caption}) {
        commit(types.ADD_TAB, {id, caption});
    },
    [types.SELECT_TAB]: function({commit}, {id}) {
        commit(types.SELECT_TAB, {id});
    },
    [types.POST_LINE]: function({commit}, {tab, client, message}) {
        commit(types.POST_LINE, {tab, client, message});
    },
    [types.MESSAGE]: function({commit, dispatch, getters, rootGetters}, {channel, message}) {
        // si on souhaite envoyer le message au serveur avant affichage...
        // let client = rootGetters['clients/getLocalClient'].name;
        // dispatch(types.POST_LINE, {tab: channel, client, message});
    }
};

export default actions;