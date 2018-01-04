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

		data: function() {
			return {
				idLocalClient: '', // identifiant du client local
				base: null
			}
		},

		methods: {

            /**
			 * Envoyer le login/pass au server, attendre son retour
			 * conserver l'id retourner
			 * en cas d'erreur , notifier
             * @param name
             * @param pass
             * @return {Promise<void>}
             */
			doLogin: async function(name, pass) {
                let id = await network.send_login(name, pass);
                if (id) {
                    console.log('your id is', id);
                    this.idLocalClient = id;
                    oApp.show('chat');
                } else {
                    oApp.$refs.login.raiseError();
                }
            },

            /**
			 * Renvoie true si l'identifiant est celui du cleint local
			 * sinon renvoie false
             * @param id {string}
             * @return {boolean}
             */
			isLocalClient: function(id) {
				return id === this.idLocalClient;
			},

            /**
			 * Réagit à l'arrivée d'un client sur un canal
             */
            onUserJoinsChannel: function(user, channel) {
            	if (this.isLocalClient(user)) {
            		// il faudrait créer un onglet
					console.log('add tab', channel);
//					this.base.chatAddTab()
				} else {
                    console.log('user', user, 'joins', channel);
				}
			}
		},

		mounted: function() {
			window.NETWORK = network;
			const base = this.$children[0];
			const store = base.$store;
			this.base = base;

			base.$on('submit-login', (name, pass) => this.doLogin(name, pass));
			network
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