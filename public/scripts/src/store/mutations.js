import * as types from './mutation-types';

const mutations = {
    /**
     * Ajoute un onglet dans la fenetre de discussion
     * @param state
     * @param id {number} identifiant du nouvel onglet
     * @param caption {string} nom de l'onglet, fait référence à une entrée
     * de strings.chat.tabs, sinon affiché tel quel.
     *
     */
    [types.CHAT_ADD_TAB]: function(state, {id, caption}) {
        state.chat.tabs.push({
            id: id,
            lines: [],
            caption: caption,
            notified: false
        });
    },

    /**
     * Selectionne un nouvel onglet
     * @param state
     * @param id {number} identifiant de l'onglet à selectionner
     */
    [types.CHAT_SELECT_TAB]: function(state, {id}) {
        state.chat.activeTab = state.chat.tabs.find(t => t.id === id);
        state.chat.activeTab.notified = false;
    },

    /**
     * Ajoute une line dans un onglet de la fenetre de discussion
     * @param state
     * @param tab {number} identifiant de l'onglet
     * @param client {number} id du client
     * @param message {string} contenu du message
     */
    [types.CHAT_POST_LINE]: function(state, {tab, client, message}) {
        let oChat = state.chat;
        let oTab = oChat.tabs.find(t => t.id === tab);
        if (!oTab) {
            throw new Error('could not find tab #' + tab);
        }
        let oClient = state.clients.find(c => c.id === client);
        if (!oClient) {
            throw new Error('could not find client #' + client);
        }
        oTab.lines.push({
            id: ++oChat.lastLineId,
            user: oClient.name,
            message: message,
            color: 0
        });
        if (tab !== state.chat.activeTab.id) {
            oTab.notified = true;
        }
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