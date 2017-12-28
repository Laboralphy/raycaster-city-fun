<template>
    <div>
        <login-window ref="login"></login-window>
        <chat-window ref="chat"></chat-window>
    </div>
</template>

<script>
    import vueChatWindow from './chat-window.vue';
    import vueLoginWindow from './login-window.vue';
	import * as chatActions from '../store/chat/mutation-types.js';
	import * as clientsActions from '../store/clients/mutation-types.js';
    import {mapActions, mapGetters} from 'vuex';

    export default {
        name: "application",
        components: {
            'chat-window': vueChatWindow,
            'login-window': vueLoginWindow
        },
        computed: Object.assign(
        	{},
        	mapGetters({
				getActiveTab: 'chat/getActiveTab',
				getLocalClient: 'clients/getLocalClient'
			})
        ),
        methods: Object.assign(
            {
                chatMessageToSend: function(sMessage) {
                	let idTab = this.getActiveTab().id;
                    this.chatPostLine({
                        tab: idTab,
                        client: this.getLocalClient().name,
                        message: sMessage
                    });
                    this.$refs.chat.doScrollDown(idTab);
                },

                show: function(ref) {
                    let aRefs = 'login chat'.split(' ');
                    aRefs.forEach(r => this.$refs[r].visible = ref === r);
                },

                init: function() {
                	
                    this.chatAddTab({id: 1, caption: "system"});
                    this.chatAddTab({id: 2, caption: "global"});
                    this.chatAddTab({id: 3, caption: "mission"});
                    this.chatSelectTab({id: 1});

                    this.$refs.chat.$on('send-message', this.chatMessageToSend.bind(this));
                    this.$refs.login.$on('login', () => this.show('chat'));
                    this.show('login');
                }
            },
            mapActions('chat', Object.values(chatActions))
        ),

        mounted: function() {
            this.init();
        }
    }
</script>

<style scoped>

</style>