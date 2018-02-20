/**
 * La classe implemente un système de prédiction de mouvement
 * Les changement de mouvement son transmis
 * Mise en tampon
 */


import o876 from '../../../../program/o876'

const MAX_UPDATE_TIME = 20; // Délai au dela duquel il faut mettre à jour

class ClientPrediction {
	constructor() {
		this._id = 0;
		this._packets = [];
	}

	/**
	 * getter/setter de packets
	 * Renvoie l'ensemble des paquets
	 * @param p
	 * @returns {*}
	 */
	packets(p) {
		return o876.SpellBook.prop(this, '_packets', p);
	}

	/**
	 * Renvoie le dernier packet transmis
	 * @returns {{t, a, x, y, ma, ms, v}|null}
	 */
	lastPacket() {
		return this._packets.length > 0 ? this._packets[this._packets.length - 1] : null;
	}

	/**
	 * Empile un mouvement dans la liste, à condition qu'il y ait un changement "significatif" dans les données
	 * @param a {number}
	 * @param x {number}
	 * @param y {number}
	 * @param sx {number}
	 * @param sy {number}
	 * @param c {number} une commande spéciale d'action (tir, activation, utilisation d'un obj)
	 */
	pushMovement({a, x, y, sx, sy, c = 0}) {
		let last = this.lastPacket();
		let bNoPreviousPacket = !last; // si true alors : c'est le premier packet, y'en n'a pas d'autre
		let bPush = false;
		if (bNoPreviousPacket) {
			bPush = true;
		} else if (last.t >= MAX_UPDATE_TIME || a !== last.a || sx !== last.sx || sy !== last.sy || c !== last.c) {
			// packet très différent du précédent ou ...
			// précédent packet trop ancien ou ..
			// commande "c" différente du précédent ou ...
			// premier packet de la serie alors
			// on push
			bPush = true;
		} else {
			// réutilisation du packet précédent
			++last.t;
		}
		if (bPush) {
			if (last) {
				last.send = true;
			}
			let packet = {
				t: 1,		// iteration max
				a, x, y, 	// angle, position
				sx, sy, 	// vitesse aux axes
				id: ++this._id,  // identifiant seq
				c, 				// commandes
				send: bNoPreviousPacket, 	// peut etre envoyé ? oui/non
				sent: false,		// a été envoyé ? oui/non
			};
			this._packets.push(packet);
		}
		return bPush;
	}

	getUnsentPackets() {
		let aPackets = this._packets.filter(p => !p.sent && p.send);
		aPackets.forEach(p => p.sent = true);
		return aPackets;
	}

	/**
	 * Supprimer les id inférieurs à celui spécifié
	 * on ne supprime pas le dernier packet
	 * @param id
	 */
	flush(id) {
		let iLast = this._packets.length - 1;
		this._packets = this._packets.filter((p, i) => p.id > id || i === iLast);
	}

	getPacketsAfter(id) {
		return this._packets.filter(p => p.id > id);
	}

}


export default ClientPrediction;