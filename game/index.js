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
		this.emitter.on('player.command', ({id, c}) => this.playerCommand(id, c));
	}


	playerCommand(id, c) {
		// identifier l'entité qui effectue la commande
		if (c & COMMANDS.MOUSE_LEFT) {
			// tir de l'arme principale
			this.entityPrimaryFire(id);
		}
	}



	spawnMissile(ref, location, data) {

	}


	/**
	 * Effectue un tir d'arme principale
	 * @param id {number} identifiant du joueur qui effectue l'action
	 */
	entityPrimaryFire(id) {
		let oMobile = this._mobiles[id];
		// créer le projectile
		// adjoindre des données extra de propriété du projectile
		// indiquer au client un mouvement de son arme
		let idMissile = uniqid('mis-');
		let ref = 'p_magbolt';
		let location = oMobile.location();
		let data = {};
		let oMissile = this.createMobile(idMissile, ref, location, data);
	}
}

module.exports = Game;