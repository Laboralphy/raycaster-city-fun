import * as types from './mutation-types';

const actions = {
	[types.REQ_LOGIN]: function({commit}, {login, pass}) {
		commit(types.REQ_LOGIN, {login, pass});
	},
};

export default actions;