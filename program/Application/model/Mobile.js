/**
 * Gestion d'une entité mobile dans le labyrinthe
 * Collsion
 * Décision
 */

const o876 = require('../../o876');
const RC_CONST = require('../consts/raycaster');

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
			[0, -n], // 0: N
			[n, 0],  // 1: E
			[0, n],  // 2: S
			[-n, 0]  // 3: W
		].map(e => new o876.geometry.Vector2D(e[0], e[1]));
		this.size = n;
	}

	/**
	 * Déplace le mobile selon le vector spécifié
	 * Gestion des collisions
	 * @param {o876.geometry.Vector2D} vSpeed
	 */
	move(vSpeed) {
		let ps = RC_CONST.rc_plane_spacing;
		let area = this.location.area;
		let vPos = this.location;
		let size = this.size;
		// ajouter eyes + position + vitesse
		let vNew = vPos.add(vSpeed);
		let eyes = this.eyes.map(e => vNew.add(e));
		let eyeCollisionCode = eyes
			.map(e => area.isSolidPoint(e.x, e.y))
			.reduce((prev, b, i) => prev + b << i, 0);
		// calculer les coordonnées du block
		let xb = vPos.x / ps | 0;
		let yb = vPos.y / ps | 0;
		let yn = yb * ps + size;
		let ys = (yb + 1) * ps - size - 1;
		let xw = xb * ps + size;
		let xe = (xb + 1) * ps + size - 1;
		switch (eyeCollisionCode) {
			case 0: // aucune collision
				break;

			case 1: // collision Nord uniquement
				vNew.y = yn;
				break;

			case 2: // collision Est uniquement
				vNew.x = xe;
				break;

			case 3: // collision nord-est
				vNew.x = xe;
				vNew.y = yn;
				break;

			case 4: // collision sud
				vNew.y = ys;
				break;

			case 5: // collision nord et sud (bizarre)
				vNew.y = vPos.y;
				break;

			case 6: // collision sud-est
				vNew.y = ys;
				vNew.x = xe;
				break;

			case 7: // collision nord sur et est
				vNew.y = yn;
				vNew.x = xe;
				break;

			case 8: // collision ouest
				vNew.x = xw;
				break;

			case 9: // collision nord ouest
				vNew.y = yn;
				vNew.x = xw;
				break;

			case 10: // collision ouest et est (bizarre)
				vNew.x = vPos.x;
				break;

			case 11: // collision ouest, est et nord
				vNew.x = vPos.x;
				vNew.y = yn;
				break;

			case 12: // collision sud-ouest
				vNew.x = xw;
				vNew.y = ys;
				break;

			case 13: // collision sud-ouest et nord
				// se décaler vers l'est
				vNew.y = vPos.y;
				vNew.x = xw;
				break;

			case 14: // collision sud ouest et est
				// se décaler au nord du block
				vNew.y = vPos.y;
				break;

			case 15: // collision partout (en plein dans un mur)
				// ne pas bouger
				vNew = vPos;
				break;
		}
	}



};