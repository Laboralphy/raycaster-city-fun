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
const uniqid = require('uniqid');

class Game extends Core {

	constructor() {
		super();
		// déclaration de l'évènement player.command
		// cet évènement est déclenché lorsqu'un joueur emet une commande (
		this.emitter.on('player.command', ({id, c}) => this.playerCommand(id, c));
	}


	playerCommand(id, c) {
		// identifier l'entité qui effectue la commande
		switch (c) {
			case COMMANDS.MOUSE_LEFT:
                this.mobileActionPrimaryAttack(id);
                break;
		}
	}


    /**
	 * Génère un missile
     * @param ref
     * @param location
     * @param data
     */
	spawnMissile(ref, location, data) {
        let idMissile = uniqid('m-');
        let oMissile = this.createMobile(idMissile, ref, location, data);
	}


	/**
	 * Effectue un tir d'arme principale
	 * @param id {number} identifiant du mobile qui effectue l'action
	 */
	mobileActionPrimaryAttack(id) {
		let oMobile = this._mobiles[id];
		// créer le projectile
		// adjoindre des données extra de propriété du projectile
		// indiquer au client un mouvement de son arme
		let ref = 'p_magbolt';
		let location = oMobile.location();
		let data = {};
		let oMissile = this.spawnMissile(ref, location, data);
	}
}

module.exports = Game;