<template>
    <div>
        <login-window ref="login"></login-window>
        <chat-window ref="chat"></chat-window>
    </div>
</template>

<script>
    import vueChatWindow from './chat-window.vue';
    import vueLoginWindow from './login-window.vue';
    import * as types from '../store/chat/mutation-types.js';
    import {mapActions} from 'vuex';

    export default {
        name: "application",
        components: {
            'chat-window': vueChatWindow,
            'login-window': vueLoginWindow
        },
        methods: Object.assign(
            {
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
                    this.$store.dispatch('chat/' + types.CHAT_ADD_TAB, {id: 1, caption: "system"});
                    this.$store.dispatch('chat/' + types.CHAT_ADD_TAB, {id: 2, caption: "global"});
                    this.$store.dispatch('chat/' + types.CHAT_ADD_TAB, {id: 3, caption: "mission"});
                    this.$store.dispatch('chat/' + types.CHAT_SELECT_TAB, {id: 1});

                    this.$refs.chat.$on('send-message', this.chatMessageToSend.bind(this));
                    this.$refs.login.$on('login', () => this.show('chat'));
                    this.show('login');
                }
            },
            mapActions(['clients', 'chat'])
        ),

        mounted: function() {
            this.init();
        }
    }
</script>

<style scoped>

</style>