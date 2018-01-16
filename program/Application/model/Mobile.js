/**
 * Gestion d'une entité mobile dans le labyrinthe
 * Collsion
 * Décision
 */

const o876 = require('../../o876');

module.exports = class Mobile {
	constructor() {
		// position & angle
		this.location = new o876.geometry.Location();
		// vitesse
		this.speed = new o876.geometry.Vector2D(0, 0);
		this.size = 16;
		this.eyes = [];
	}

	setSize(n) {
		this.eyes = [
			[0, -n], // 0: up
			[n, 0],  // 1: right
			[0, n],  // 2: down
			[-n, 0]  // 3: left
		].map(e => new o876.geometry.Vector2D(e[0], e[1]));
		this.size = n;
	}

	/**
	 * Calcule la clé de vecteur de déplacement
	 * 1: le vecteur se dirige vers le bas et la gauche
	 * 2: le vecteur se dirige vers le bas
	 * 3: le vecteur se dirige vers le bas et la droite
	 * 4: le vecteur se dirige vers la gauche
	 * 5: le vecteur est null
	 * 6: le vecteur se dirige vers la droite
	 * 7: le vecteur se dirige vers le haut et la gauche
	 * 8: le vecteur se dirige vers le haut
	 * 9: le vecteur se dirige vers le haut et la droite
	 * @param {o876.geometry.Vector2D} v
	 * @return {number}
	 */
	static getMovementHash(v) {
		let vHash = 10 * (Math.sign(v.x) + 1) + Math.sign(v.y) + 1;
		switch (vHash) {
			case  0: return 7;
			case  1: return 4;
			case  2: return 1;
			case 10: return 8;
			case 11: return 5;
			case 12: return 2;
			case 20: return 9;
			case 21: return 6;
			case 22: return 3;
		}
		return 0;
	}

	/**
	 * Déplace le mobile selon le vector spécifié
	 * Gestion des collisions
	 * @param {o876.geometry.Vector2D} vSpeed
	 */
	move(vSpeed) {
		let area = this.location.area;
		let vLoc = this.location;
		let p = this.eyes.map(e => vLoc.add(vSpeed.add(e)));

	}

};