import * as types from './mutation-types';

const actions = {
	[types.SHOW]: async function ({commit}) {
		commit(types.SHOW);
	},

	[types.HIDE]: async function ({commit}) {
		commit(types.SHOW);
	},

	[types.SHOW_SECTION]: async function ({commit, dispatch}, {id}) {
		commit(types.SHOW_SECTION, {id});
	},

	[types.HIDE_SECTION]: async function ({commit, dispatch}, {id}) {
		commit(types.HIDE_SECTION, {id});
	}
};

export default actions