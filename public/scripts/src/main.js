import Vue from 'vue';
import store from './store';
import UI from './components/UserInterface.vue';
import ApplicationConst from './data/const';
import STRINGS from './data/strings';
import Game from './game/index';
import CONFIG from './game/config';



function createApplicationGame() {
	Vue.use(ApplicationConst);
	Vue.use(STRINGS);

	const app = new Vue({
		el: '#user-interface',
		store,
		components: {
			'application': UI
		},

		render: h => h(UI),

		data: function() {
			return {
				ui: null
			}
		},

		methods: {

			startGame: function() {
				const g = new Game();
				MAIN.configure(CONFIG);
				MAIN.run(g);
                MAIN.pointerlock.on('enter', event => {
                	this.$store.dispatch('ui/hide');
                    g.hideOverlay();
                    document.querySelector('canvas#screen').style.filter = '';
                });
                g.on('blur', event => {
                    //this.ui.show('ui');
                    //this.ui.show('gameMenu');
                    //this.ui.$refs.gameMenuWrapper.selectTab('#inventaire');
					this.$store.dispatch('ui/showSection', {id: 'chat'});
					this.$store.dispatch('ui/show');
                    document.querySelector('canvas#screen').style.filter = 'blur(5px)';
				});
                document.body.setAttribute('class', 'playing');
			},

			endGame: function() {
				if (MAIN.game) {
					MAIN.game._halt();
				}
                document.body.setAttribute('class', '');
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
			 * @param login
			 * @param pass
			 * @return {Promise<void>}
			 */
			sendLogin: async function(login, pass) {
				await this.$store.dispatch('net/reqLogin', {login, pass});
				if (this.$store.getters['clients/getLocalClient'].id) {
					// connecté
					this.startGame();
				} else {
					console.warn('not connected');
				}
			},

			/**
			 * Envoyer un message de discussion à destination du canal actuelement actif
			 * @param message
			 * @returns {Promise<void>}
			 */
			sendMessage: async function(message) {
				let channel = this.$store.getters['chat/getActiveTab'].id;
				this.$store.dispatch('net/msSay', {channel, message});
			}
		},

		mounted: async function() {
			//this.ui = this.$children[0];
			let ui = this.$children[0];

			// prise en charge des évènement issus des composants
			ui.$refs.login.$on('submit', (login, pass) => this.sendLogin(login, pass));
			ui.$refs.chat.$on('message', (message) => this.sendMessage(message));

			await this.$store.dispatch('ui/showSection', {id: 'login'});
			await this.$store.dispatch('ui/show');
		}
	});

	return app;
}



function main () {
    window.Application = createApplicationGame();
}

window.addEventListener('load', main);