const socket = io();

import store from './store';
import * as types from "./store/mutation-types";
import vueChatWindow from './components/chat-window.vue';

function main () {

    const app = new Vue({
        el: '#user-interface',
        store,
        components: {
            'chat-window': vueChatWindow
        },
        methods: {
            init: function() {
                this.$store.dispatch(types.CHAT_ADD_TAB, {id: 1, caption: "system"});
                this.$store.dispatch(types.CHAT_ADD_TAB, {id: 2, caption: "global"});
                this.$store.dispatch(types.CHAT_ADD_TAB, {id: 3, caption: "mission"});
                this.$store.dispatch(types.CHAT_SELECT_TAB, {id: 1});
                this.$store.dispatch(types.CLIENT_CONNECT, {id: 10, name: 'Moi'});
                this.$store.dispatch(types.CLIENT_SET_LOCAL, {id: 10});

                this.$refs.chat.$on('send-message', (function(sMessage) {
                    let oChat = this.$store.state.chat;
                    let idTab = oChat.activeTab.id;
                    this.$store.dispatch(types.CHAT_POST_LINE, {
                        tab: idTab,
                        client: this.$store.getters.getLocalClient.id,
                        message: sMessage
                    });
                    this.$refs.chat.doScrollDown(idTab);
                }).bind(this));
            }
        },
        mounted: function() {
            this.init();
        }
    });

    window.Application = app;
}

window.addEventListener('load', main);