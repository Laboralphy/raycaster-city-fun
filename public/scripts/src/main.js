const socket = io();

import vueChatWindow from './components/chat-window.vue';

function main () {

    const app = new Vue({
        el: '#user-interface',
        components: {
            'chat-window': vueChatWindow
        },
        mounted: function() {
            this.$refs.chat.$on('send-message', (function(sMessage) {
                this.$refs.chat.write(this.$refs.chat.tab, 'Ralphy', 0, sMessage);
            }).bind(this));
        }
    });

    window.Application = app;
}

window.addEventListener('load', main);