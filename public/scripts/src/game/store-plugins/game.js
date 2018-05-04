export default function ({socket, game}) {
    return store => {

		/**
		 * Lorsqu'on reprend le controle de la souris (touche ECHAP)
		 * On freeze le jeu, on affiche l'interface utilisateur.
		 */
		game.on('pointer.unlock', event => {
			game.freeze();
			store.dispatch('ui/showSection', {id: 'chat'});
			store.dispatch('ui/show');
        });

		/**
		 * Lorsqu'on reprend le controle du jeu (en abandonnant le controle de la souris)
		 * On cache l'interface utilisateur, puis on dégèle le jeu
		 */
        game.on('pointer.lock', event => {
			store.dispatch('ui/hide');
			game.thaw();
        });

		/**
		 * Lorsque le jeu se termine, on montre l epopup de déconnexion
		 */
		game.on('halt', event => {
			store.dispatch('ui/hideSection', {id: 'chat'});
			store.dispatch('ui/showSection', {id: 'disconnect'});
			store.dispatch('ui/show');
        });
    }
}