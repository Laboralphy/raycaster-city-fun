import actions from './actions';
import state from './state';
import mutations from './mutations';
import getters from './getters';
import modules from './modules';

import Vue from "vue";
import Vuex from "vuex";


Vue.use(Vuex);
const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    modules
});


export default store;