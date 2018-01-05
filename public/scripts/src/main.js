import Vue from 'vue';
import store from './store';
import vueApplicationChat from './components/ApplicationChat.vue';
import App from './components/App.vue';
import ApplicationConst from './data/const';
import STRINGS from './data/strings';
import Network from './network/index';


/**
 * DEMO : Instancie l'application pour une utilisation chat
 * @returns {CombinedVueInstance<V extends Vue, Object, Object, Object, Record<never, any>>}
 */
function createApplicationChat() {
	Vue.use(ApplicationConst);
	Vue.use(STRINGS);

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
				base: null
			}
		},

		methods: {




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
                    this.base.show('chat');
                } else {
					this.base.$refs.login.raiseError();
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
			this.base = this.$children[0];

			// prise en charge des évènement issus des composants
			this.base.$on('submit-login', (name, pass) => this.sendLogin(name, pass));
			this.base.$on('send-message', (message) => this.sendMessage(message));
			network.useStore(this.$store);
			network.on('disconnect', () => this.base.show('login'));
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
    window.Application = createApplicationChat();
}

window.addEventListener('load', main);