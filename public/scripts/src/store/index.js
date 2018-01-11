import modules from './modules';

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    modules
});
console.log(modules);

export default store;