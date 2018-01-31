import * as types from './mutation-types';

const mutations = {
	/**
     * Reception d'information d'un client
	 * @param state
	 * @param id {string} identifiant client
	 * @param name {string} nom du client
	 */
	[types.INFO]: function(state, {id, name}) {
        state.clients[id] = {id, name};
    },

    /**
     * Il peut y avoir plusieurs clients. Cette methode permet de définir
     * le client local sur lequel est installé l'appli
     * @param state
     * @param id {number} identifiant du client
     */
    [types.SET_LOCAL]: function(state, {id}) {
        state.localClient = state.clients[id];
    },

    /**
     * Le client fait une tentative d'identifiaction
     * @param state
     * @param name
     */
    [types.SUBMIT]: function(state, {login, pass}) {
        state.lastLogin = login;
        state.lastPass = pass;
    }
};

export default mutations;