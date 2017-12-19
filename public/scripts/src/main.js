const socket = io();

import store from './store';
import * as types from "./store/mutation-types";
import vueChatWindow from './components/chat-window.vue';
import vueLoginWindow from './components/login-window.vue';

function main () {

    const app = new Vue({
        el: '#user-interface',
        store,
        components: {
            'chat-window': vueChatWindow,
            'login-window': vueLoginWindow
        },
        methods: {

            chatMessageToSend: function(sMessage) {
                let oChat = this.$store.state.chat;
                let idTab = oChat.activeTab.id;
                this.$store.dispatch(types.CHAT_POST_LINE, {
                    tab: idTab,
                    client: this.$store.getters.getLocalClient.id,
                    message: sMessage
                });
                this.$refs.chat.doScrollDown(idTab);
            },

            show: function(ref) {
                let aRefs = 'login chat'.split(' ');
                aRefs.forEach(r => this.$refs[r].visible = ref === r);
            },

            init: function() {
                this.$store.dispatch(types.CHAT_ADD_TAB, {id: 1, caption: "system"});
                this.$store.dispatch(types.CHAT_ADD_TAB, {id: 2, caption: "global"});
                this.$store.dispatch(types.CHAT_ADD_TAB, {id: 3, caption: "mission"});
                this.$store.dispatch(types.CHAT_SELECT_TAB, {id: 1});

                this.$refs.chat.$on('send-message', this.chatMessageToSend.bind(this));
                this.$refs.login.$on('login', () => this.show('chat'));
                this.show('login');
            }
        },
        mounted: function() {
            this.init();
        }
    });

    window.Application = app;
}

window.addEventListener('load', main);