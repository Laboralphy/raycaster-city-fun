import Vue from 'vue';
import store from './store';
import UI from './components/UserInterface.vue';
import ApplicationConst from './data/const';
import STRINGS from './data/strings';



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

		mounted: async function() {
			let ui = this.$children[0];

			// prise en charge des évènements issus des composants
			ui.$refs.login.$on('submit', (login, pass) => this.$store.dispatch('net/reqLogin', {login, pass}));
			ui.$refs.chat.$on('message', (message) => {
                let channel = this.$store.getters['chat/getActiveTab'].id;
                this.$store.dispatch('net/msSay', {channel, message});
			});

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