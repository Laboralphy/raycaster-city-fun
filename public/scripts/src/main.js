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
			 * Renvoie true si l'identifiant est celui du client local
			 * sinon renvoie false
			 * @param id {string}
			 * @return {boolean}
			 */
			isLocalClient: function(id) {
				return id === this.idLocalClient;
			},



			initNetwork: function() {
				// #####   ######   ####   ######     #    #    #     #    #    #   ####
				// #    #  #       #    #  #          #    #    #     #    ##   #  #    #
				// #    #  #####   #       #####      #    #    #     #    # #  #  #
				// #####   #       #       #          #    #    #     #    #  # #  #  ###
				// #   #   #       #    #  #          #     #  #      #    #   ##  #    #
				// #    #  ######   ####   ######     #      ##       #    #    #   ####

				// ECOUTEURS PERMETTANT DE CAPTER LES MESSAGES RESEAUX VENANT DU SERVEUR




				// GENERAL PURPOSE
				// GENERAL PURPOSE
				// GENERAL PURPOSE

				/**
				 * Serveur : "Déconnexion du client"
				 */
				network.on('disconnect', () => {
					this.base.show('login');
					this.base.chatReset();
				});




				// MS : MESSAGE SYSTEM
				// MS : MESSAGE SYSTEM
				// MS : MESSAGE SYSTEM

				/**
				 * Serveur : "vous venez de rejoindre un canal"
				 */
				network.on('MS_YOU_JOIN', async ({id}) => {
					let oChannel = await network.req_ms_chan_info(id);
					if (oChannel) {
						this.base.createAndSelectTab(oChannel.id, oChannel.name);
					}
				});

				/**
				 * Serveur : "un utilisateur a rejoin l'un des canaux auxquels vous êtes connecté"
				 */
				network.on('MS_USER_JOINS', async ({user, channel}) => {
					let oUser = await network.req_ms_user_info(user);
					let oChannel = await network.req_ms_chan_info(channel);
					this.base.print(oChannel.id, '', oUser.name + ' à rejoin le canal ' + oChannel.name);
				});

				/**
				 * Serveur : "un utilisateur a quitté l'un des canaux auxquels vous êtes connecté"
				 */
				network.on('MS_USER_LEAVES', async ({user, channel}) => {
					let oUser = await network.req_ms_user_info(user);
					let oChannel = await network.req_ms_chan_info(channel);
					this.base.print(oChannel.id, '', oUser.name + ' à quitté le canal ' + oChannel.name);
				});

				/**
				 * Serveur : "un utilisateur a envoyé un message de discussion sur un canal"
				 */
				network.on('MS_USER_SAYS', async ({user, channel, message}) => {
					let oUser = await network.req_ms_user_info(user);
					let oChannel = await network.req_ms_chan_info(channel);
					this.base.print(oChannel.id, oUser.name, message);
				});
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
                    this.idLocalClient = id;
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

			// initialisation du protocole réseau
			this.initNetwork();
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