export default function (socket, game) {
    return store => {
        // game.on('.....', () => {});
        game.on('pointer.unlock', event => {
			game.freeze();
			store.dispatch('ui/showSection', {id: 'chat'});
			store.dispatch('ui/show');
        });

        game.on('pointer.lock', event => {
			store.dispatch('ui/hide');
			game.thaw();
        });

        game.on('halt', event => {
			store.dispatch('ui/hideSection', {id: 'chat'});
			store.dispatch('ui/showSection', {id: 'disconnect'});
			store.dispatch('ui/show');
        });
    }
}