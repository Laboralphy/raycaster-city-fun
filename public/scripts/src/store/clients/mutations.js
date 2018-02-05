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
     * Ajoute un nouveau client
     * @param state {*} etat
     * @param id {number} identifiant du client
     * @param name {string} nom du client
     */
    [types.CLIENT_CONNECT]: function(state, {id, name}) {
        state.clients.push({
            id: id,
            name: name
        });
    },

    /**
     * supprime un client
     * @param state
     * @param id {number} identifiant du client qui s'en va
     */
    [types.CLIENT_DISCONNECT]: function(state, {id}) {
        let iClient = state.clients.findIndex(c => c.id === id);
        if (iClient >= 0) {
            state.clients.splice(iClient, 1);
        }
    },

    /**
     * Il peut y avoir plusieurs clients. Cette methode permet de définir
     * le client local sur lequel est installé l'appli
     * @param state
     * @param id {number} identifiant du client
     */
    [types.CLIENT_SET_LOCAL]: function(state, {id}) {
        state.localClient = state.clients.find(c => c.id === id);
    }
};

export default mutations;