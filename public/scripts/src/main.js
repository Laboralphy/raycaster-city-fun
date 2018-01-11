import Vue from 'vue';
import store from './store';
import vueApplicationChat from './components/ApplicationChat.vue';
import App from './components/App.vue';
import ApplicationConst from './data/const';
import STRINGS from './data/strings';
import Network from './network/index';
import Game from './game/index';
import CONFIG from './game/config';



function createApplicationGame() {
	Vue.use(ApplicationConst);
	Vue.use(STRINGS);

	let network = new Network();

	const app = new Vue({
		el: '#user-interface',
		store,
		components: {
			'application': App
		},

		render: h => h(App),

		data: function() {
			return {
				base: null
			}
		},

		methods: {

			startGame: function() {
				const g = new Game();
				MAIN.configure(CONFIG);
				MAIN.run(g);
				MAIN.pointerlock.on('enter', event => g.hideOverlay());
			},


			//  ####   ######  #    #  #####      #    #    #   ####
			// #       #       ##   #  #    #     #    ##   #  #    #
			//  ####   #####   # #  #  #    #     #    # #  #  #
			//      #  #       #  # #  #    #     #    #  # #  #  ###
			// #    #  #       #   ##  #    #     #    #   ##  #    #
			//  ####   ######  #    #  #####      #    #    #   ####

			// METHODES PERMETTANT D'ENVOYER DES MESSAGES RESEAUX AU SERVEUR


			/**
			 * Envoyer le login/pass au server, attendre son retour
			 * conserver l'id retourner
			 * en cas d'erreur , notifier
			 * @param name
			 * @param pass
			 * @return {Promise<void>}
			 */
			sendLogin: async function(name, pass) {
				let id = await network.req_login(name, pass);
				if (id) {
					this.startGame();
				} else {
					// @TODO coller une erreur de connexion visible pour l'utilisateur
				}
			},

			/**
			 * Envoyer un message de discussion à destination du canal actuelement actif
			 * @param message
			 * @returns {Promise<void>}
			 */
			sendMessage: async function(message) {
				network.send_ms_say(this.$store.getters['chat/getActiveTab']().id, message);
			}
		},

		mounted: function() {
			//this.base = this.$children[0];

			// prise en charge des évènement issus des composants
			//this.base.$on('submit-login', (name, pass) => this.sendLogin(name, pass));
			//this.base.$on('send-message', (message) => this.sendMessage(message));
			network.useStore(this.$store);
			this.sendLogin('ralphy', '');
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
	Vue.use(STRINGS);

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
    window.Application = createApplicationGame();
}

window.addEventListener('load', main);