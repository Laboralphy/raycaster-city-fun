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
        state.tabs.push({
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
        state.activeTab = state.tabs.find(t => t.id === id);
        state.activeTab.notified = false;
    },

    /**
     * Ajoute une line dans un onglet de la fenetre de discussion
     * @param state
     * @param tab {number} identifiant de l'onglet
     * @param client {number} id du client
     * @param message {string} contenu du message
     */
    [types.CHAT_POST_LINE]: function(state, {tab, client, message}) {
        let oTab = state.tabs.find(t => t.id === tab);
        if (!oTab) {
            throw new Error('could not find tab #' + tab);
        }
        let oClient = state.$root.clients.find(c => c.id === client);
        if (!oClient) {
            throw new Error('could not find client #' + client);
        }
        oTab.lines.push({
            id: ++state.lastLineId,
            user: oClient.name,
            message: message,
            color: 0
        });
        if (tab !== state.activeTab.id) {
            oTab.notified = true;
        }
    },

};

export default mutations;