const socket = io();

import Vue from 'vue';
import store from './store';
import vueApplication from './components/application.vue';

function main () {

    const app = new Vue({
        el: '#user-interface',
        store,
        components: {
            'application': vueApplication
        },
        render: h => h(vueApplication)
    });

    window.Application = app;
}

window.addEventListener('load', main);