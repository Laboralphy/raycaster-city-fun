<template>
    <div>
        <login-window ref="login"></login-window>
        <chat-window ref="chat"></chat-window>
    </div>
</template>

<script>
    import vueChatWindow from './ChatWindow.vue';
    import vueLoginWindow from './LoginWindow.vue';
	import * as chatActions from '../store/chat/mutation-types.js';
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
				createAndSelectTab: function(idTab, sCaption) {
					this.chatAddTab({id: idTab, caption: sCaption});
					this.chatSelectTab({id: idTab});
				},

				print: function(idTab, sUser, sMessage) {
					this.chatPostLine({tab: idTab, client: sUser, message: sMessage});
					this.$refs.chat.doScrollDown(idTab);
				},

                show: function(ref) {
                    let aRefs = 'login chat'.split(' ');
                    aRefs.forEach(r => this.$refs[r].visible = ref === r);
                },

                init: function() {
                    this.$refs.chat.$on('send-message', (message) => this.$emit('send-message', message));
                    this.$refs.login.$on('form-submit', (name, pass) => this.$emit('submit-login', name, pass));
                    this.show('login');
                }
            },
			mapActions('chat', Object.values(chatActions)),

        ),

        mounted: function() {
            this.init();
        }
    }
</script>

<style scoped>

</style>