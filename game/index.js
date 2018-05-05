/**
 * Ceci est la classe de jeu, basée sur Engine/Core
 * @type {Core}
 * @class Game
 *
 *
 *
 */

const Core = require('../framework/engine/Core');
const COMMANDS = require('../framework/consts/commands');
const RC = require('../framework/consts/raycaster');
const EVENTS = require('../framework/consts/events');
const Thinkers = require('./thinkers');
const o876 = require('../framework/o876');

class Game extends Core {

	constructor() {
		super();
		// déclaration de l'évènement player.command
		// cet évènement est déclenché lorsqu'un joueur emet une commande (
        this.on(EVENTS.MOBILE_COMMAND, ({mobile, command}) => this.coreEventMobileCommand(mobile, command));
        this.on(EVENTS.MOBILE_CREATED, ({players, mobile}) => this.coreEventMobileCreated(mobile));
        this.on(EVENTS.MOBILE_DESTROYED, ({players, mobile}) => this.coreEventMobileDestroyed(mobile));

	}

    coreEventMobileCreated(mobile) {
    }

    coreEventMobileDestroyed(mobile) {
    }


	coreEventMobileCommand(mobile, command) {
		// identifier l'entité qui effectue la commande
		switch (command) {
			case COMMANDS.PRIMARY_ACTION:
                this.mobileActionPrimaryAttack(mobile);
                break;
		}
	}




	/**
	 * Effectue un tir d'arme principale
	 * @param oMobile {*} identifiant du mobile qui effectue l'action
	 */
	mobileActionPrimaryAttack(oMobile) {
		// créer le projectile
		// adjoindre des données extra de propriété du projectile
		// indiquer au client un mouvement de son arme
		let oMissile = this.spawnMissile('p_magbolt', oMobile, {});
	}
}

module.exports = Game;