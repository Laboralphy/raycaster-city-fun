const socket = io();

import Vue from 'vue';
import store from './store';
import vueApplicationChat from './components/ApplicationChat.vue';

function main () {

    const app = new Vue({
        el: '#user-interface',
        store,
        components: {
            'application': vueApplicationChat
        },
        render: h => h(vueApplicationChat)
    });

    window.Application = app;
}

window.addEventListener('load', main);