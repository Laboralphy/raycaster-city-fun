const STRINGS_DB = {
    fr: {
        ui: {
            chat: {
                title: 'Discussion',
                placeholder: 'Message...'
            },
            login: {
                title: 'Connexion',
                login: 'Identifiant',
                pass: 'Mot de passe',
                connect: 'Se connecter',
                error: 'Connexion impossible...'
            },
            disconnect: {
                title: 'Déconnexion',
                message: 'Vous avez perdu la connexion avec le serveur. Essayez de vous reconnecter ultérieurement...'
            }
        }
    }
};

export const STRINGS = STRINGS_DB.fr;


const ApplicationStrings = {
	install(Vue, options) {
		Vue.prototype.STRINGS = STRINGS;
		String.prototype.with = function(oReplaces) {
			let s = this;
			for (let sPattern in oReplaces) {
				let r = new RegExp('\$' + sPattern, 'gu');
				s = s.replace(r, oReplaces[sPattern]);
			}
			return s;
		}
	}
};

export default ApplicationStrings;
