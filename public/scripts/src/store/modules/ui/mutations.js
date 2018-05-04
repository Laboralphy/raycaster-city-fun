import * as types from './mutation-types';

const mutations = {

    /**
     * Rend la fenetre de login visible
     * @param state
     */
    [types.SHOW]: function (state) {
        state.visible = true;
    },

    /**
     * Rend la fenetre de login invisible
     * @param state
     */
    [types.HIDE]: function (state) {
        state.visible = false;
    },

	/**
     * Affichage d'une section
	 * @param state
	 * @param id {string} identifiant de la section à afficher
	 */
	[types.SHOW_SECTION]: function(state, {id}) {
        if (id in state.sections) {
			state.sections[id].visible = true;
        } else {
        	throw new Error('this section does not exist : ' + id)
		}
	},

	/**
     * Dissimulation d'une section
	 * @param state
	 * @param id {string} identifiant de la section à cacher
	 */
	[types.HIDE_SECTION]: function(state, {id}) {
		if (id in state.sections) {
			state.sections[id].visible = false;
		}
	},
};

export default mutations;