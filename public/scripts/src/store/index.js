import modules from './modules/index';
import plugins from './plugins/index';

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    modules,
    plugins
});


export default store;