import * as types from './mutation-types';

const actions = {
    [types.INFO]: function({commit}, {id, name}) {
        commit(types.INFO, {id, name});
    },
    [types.SET_LOCAL]: function({commit}, {id}) {
        commit(types.SET_LOCAL, {id});
    }
};

export default actions;