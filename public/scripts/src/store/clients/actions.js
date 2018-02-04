import * as types from './mutation-types';

const actions = {
    [types.INFO]: function({commit}, {id, name}) {
        commit(types.INFO, {id, name});
    },
    [types.SET_LOCAL]: function({commit}, {id}) {
        commit(types.SET_LOCAL, {id});
    },
    [types.SUBMIT]: function({commit}, {name}) {
        commit(types.SUBMIT, {name});
    },
};

export default actions;