import Vue from 'vue';
import store from './store';
import vueApplicationChat from './components/ApplicationChat.vue';
import App from './components/App.vue';
import ApplicationConst from './data/const';
import ApplicationStrings from './data/strings';
import Network from './network/index';

/**
 * DEMO : Instancie l'application pour une utilisation chat
 * @returns {CombinedVueInstance<V extends Vue, Object, Object, Object, Record<never, any>>}
 */
function createApplicationChat() {
	Vue.use(ApplicationConst);
	Vue.use(ApplicationStrings);

	let network = new Network();

	const app = new Vue({
		el: '#user-interface',
		store,
		components: {
			'application': vueApplicationChat
		},

		render: h => h(vueApplicationChat),

		mounted: function() {
			window.NETWORK = network;
			const oApp = this.$children[0];
			const store = oApp.$store;

			oApp.$on('login', function(name, pass) {
				network.req_login(name, pass);
			});
		}
	});

	return app;
}


/**
 * DEMO : Instancie l'application pour une utilisation UI
 * @returns {CombinedVueInstance<V extends Vue, Object, Object, Object, Record<never, any>>}
 */
function createApplicationUI() {
	Vue.use(ApplicationConst);
	Vue.use(ApplicationStrings);

	const app = new Vue({
		el: '#user-interface',
		store,
		components: {
			App
		},
		render: h => h(App)
	});

	return app;
}


function main () {
    window.Application = createApplicationChat();
}

window.addEventListener('load', main);