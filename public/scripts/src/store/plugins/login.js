import STATUS from "../../../../../program/consts/status";

function login(socket) {
	return store => {


		/**
		 * Envoi au serveur des données d'identification,
		 * renvoie par Promise un identifiant client si l'identification a réussi, sinon, renvoie null.
		 * @param name {string} nom
		 * @param pass {string}        if (this.isFree()) {
				this.oGame.gm_attack(0);
			} else {
				this.wtfHeld();
			}
		 this.nChargeStartTime = this.oGame.getTime();
		 mot de passe
		 */
		async function req_login(name, pass) {
			return new Promise(
				resolve => {
					socket.emit(
						'REQ_LOGIN',
						{name, pass},
						({id}) => resolve(id)
					)
				}
			);
		}


		//  ####   #    #  #####    ####    ####   #####      #    #####   ######
		// #       #    #  #    #  #       #    #  #    #     #    #    #  #
		//  ####   #    #  #####    ####   #       #    #     #    #####   #####
		//      #  #    #  #    #       #  #       #####      #    #    #  #
		// #    #  #    #  #    #  #    #  #    #  #   #      #    #    #  #
		//  ####    ####   #####    ####    ####   #    #     #    #####   ######


		store.subscribeAction(async (action) => {
			switch (action.type) {

				case 'clients/submit':
					// le client souhaite se connecter
					let id = await req_login(action.payload.login, action.payload.pass);
					if (id) {
						await store.dispatch('clients/info', {id, name: action.payload.login});
						await store.dispatch('clients/setLocal', {id});
						//
						await store.dispatch('ui/hideSection', {id: 'login'});
						await store.dispatch('ui/hide');
					} else {
						// on a eu un soucis d'identification
					}
					break;
			}
		});
	};
}

export default login;