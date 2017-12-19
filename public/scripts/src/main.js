const socket = io();

import store from './store';
import Vue from 'vue';
import App from './components/App.vue'
import ApplicationConst from './data/const';

function main () {
    Vue.use(ApplicationConst);

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