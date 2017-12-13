import actions from './actions';
import state from './state';
import mutations from './mutations';
import getters from './getters';


const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters
});


export default store;