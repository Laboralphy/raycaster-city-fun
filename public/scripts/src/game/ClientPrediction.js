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
	 * @returns {{t, a, x, y, ma, ms, v}}
	 */
	lastPacket() {
		return this._packets[this._packets.length - 1];
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
		let bPush = false;
		if (!last) {
			// premier packet : on push d'office
			bPush = true;
		} else if (last.t >= MAX_UPDATE_TIME || a !== last.a || sx !== last.sx || sy !== last.sy || c) {
			// packet très différent ou précédent packet trop ancien ou commande "c" renseignée
			// on push
			bPush = true;
		} else {
			// packet identique et assez récent : on incrémente "t" du precedent packet
			++last.t;
		}
		if (bPush) {
			if (last) {
				last.send = true;
			}
			this._packets.push({
				t: 1,		// iteration max
				a, x, y, 	// angle, position
				sx, sy, 	// vitesse aux axes
				id: ++this._id,  // identifiant seq
				c, 				// commandes
				send: false, 	// peut etre envoyé ? oui/non
				sent: false		// a été envoyé ? oui/non
			});
		}
	}

	getUnsentPackets() {
		let aPackets = this._packets.filter(p => !p.sent && p.send);
		aPackets.forEach(p => p.sent = true);
		return aPackets;
	}

	/**
	 * Supprimer les id inférieurs à celui spécifié
	 * @param id
	 */
	flush(id) {
		this._packets = this._packets.filter(p => p.id > id);
	}
}


export default ClientPrediction;