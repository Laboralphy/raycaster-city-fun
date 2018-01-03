const STRINGS_DB = {
    fr: {
        ui: {
            chat: {
                title: 'Discussion',
                tabs: {
                    system: 'Système',
                    global: 'Global',
                    mission: 'Mission'
                },
                placeholder: 'Message...'
            },
            login: {
                title: 'Connexion',
                login: 'Identifiant',
                pass: 'Mot de passe',
                connect: 'Se connecter',
                error: 'Connexion impossible...'
            }
        }
    }
};

export const STRINGS = STRINGS_DB.fr;


const ApplicationStrings = {
	install(Vue, options) {
		Vue.prototype.STRINGS = STRINGS;
	}
};

export default ApplicationStrings;
