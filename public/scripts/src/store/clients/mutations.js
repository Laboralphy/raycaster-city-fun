import * as types from './mutation-types';

const mutations = {

    /**
     * Rend la fenetre de login visible
     * @param state
     */
    [types.CLIENT_SHOW]: function(state) {
        state.visible = true;
    },

    /**
     * Rend la fenetre de login invisible
     * @param state
     */
    [types.CLIENT_HIDE]: function(state) {
        state.visible = false;
    },


	/**
     * Reception d'information d'un client
	 * @param state
	 * @param id {string} identifiant client
	 * @param name {string} nom du client
	 */
	[types.CLIENT_INFO]: function(state, {id, name}) {
        state.clients[id] = {name};
    },

    /**
     * Il peut y avoir plusieurs clients. Cette methode permet de définir
     * le client local sur lequel est installé l'appli
     * @param state
     * @param id {number} identifiant du client
     */
    [types.CLIENT_SET_LOCAL]: function(state, {id}) {
        state.localClient = state.clients[id];
    },

	/**
     * Le client local souhaite se connecter
	 * @param state
	 * @param id
	 */
	[types.CLIENT_LOGIN]: function(state, {login, pass}) {

    }
};

export default mutations;