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
const Thinkers = require('./thinkers');

class Game extends Core {

	constructor() {
		super();
		// déclaration de l'évènement player.command
		// cet évènement est déclenché lorsqu'un joueur emet une commande (
		this.emitter.on('player.command', ({mob, command}) => this.playerCommand(mob, command));

		/*
		mobile.created
		mobile.destroyed
		player.command
		 */
	}


	playerCommand(mob, command) {
		// identifier l'entité qui effectue la commande
		switch (command) {
			case COMMANDS.MOUSE_LEFT:
				console.log("mouse left !");
                this.mobileActionPrimaryAttack(mob);
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
        let th = new Thinkers.Missile();
        th.mobile(oMissile);
        oMissile.thinker(th);
        return oMissile;
	}


	/**
	 * Effectue un tir d'arme principale
	 * @param oMobile {*} identifiant du mobile qui effectue l'action
	 */
	mobileActionPrimaryAttack(oMobile) {
		// créer le projectile
		// adjoindre des données extra de propriété du projectile
		// indiquer au client un mouvement de son arme
		let oMissile = this.spawnMissile('p_magbolt', oMobile.location, {});
	}
}

module.exports = Game;