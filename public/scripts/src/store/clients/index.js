import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import actions from './actions';
import state from './state';
import mutations from './mutations';
import getters from './getters';


const store = new Vuex.Store({
    namespaced: true,
    state,
    mutations,
    actions,
    getters
});


export default store;