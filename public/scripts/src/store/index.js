import modules from './modules';
import plugins from './plugins';

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    modules,
    plugins
});


export default store;