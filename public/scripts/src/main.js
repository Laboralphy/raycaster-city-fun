const socket = io();

import store from './store';
import Vue from 'vue';
import App from './components/App.vue'

function main () {
    const app = new Vue({
        el: '#user-interface',
        store,
        components: {
            App
        },
        render: h => h(App)
    });

    window.Application = app;
}

window.addEventListener('load', main);