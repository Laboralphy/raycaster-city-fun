/**
 * Permet de composer une carte compréhensible par le raycaster
 * Ceci peut servir de base à un générateur aléatoire de niveau afin de produire le niveau final transmissible aux clients
 * et analysable par l'objet Area
 */
const o876 = require('../../o876');


module.exports = class Level {


	constructor() {
		this._map = {
			lower: new o876.collider.Grid(),
			upper: new o876.collider.Grid(),
		};
		this._map.lower.on('rebuild', data => data.cell = {
			phys: 0,
			offs: 0,
			text: 0
		});
		this._map.upper.on('rebuild', data => data.cell = {
			phys: 0,
			offs: 0,
			text: 0
		});
		this._visual = {
			ceilColor: {
				r: 0,
				g: 0,
				b: 0
			},
			fogColor: {
				r: 0,
				g: 0,
				b: 0
			},
			floorColor: {
				r: 0,
				g: 0,
				b: 0
			},
			fogDistance: 1,
			light: 100,
			diffuse: 0,
			filter: false,
		};
		this._walls = {
			src: '',
			codes: []
		};
		this._flats = {
			src: '',
			codes: []
		};
		this._startpoint = {
			x: 416,
			y: 416,
			angle: 0
		};
		this._tiles = {};
		this._blueprints = {};
		this._objects = [];
		this._tags = [];
		this._decals = [];
		this._background = null;
		this._options = {
			stretch: false
		};
	}


	/**
	 * Getter/setter de la taille de la carte
	 * @param n
	 */
	size(n) {
		if (n === undefined) {
			return this._map.width();
		} else {
			return this._map.width(n).height(n);
		}
	}

	/**
	 * Lecture modification du code complet en x, y
	 * @param level {string} niveau "lower" ou "upper"
	 * @param x {number}
	 * @param y {number}
	 * @param data {string} varriab
	 * @param code {number}
	 * @return {this|number}
	 */
	map(level, x, y, data, code) {
		if (code === undefined) {
			return this._map[level].cell(x, y)[data];
		} else {
			this._map[level].cell(x, y)[data] = code;
			return this;
		}
	}

	/**
	 * Lecture modification du code texture en x, y
	 * @param level {string} niveau "lower" ou "upper"
	 * @param x {number}
	 * @param y {number}
	 * @param code {number}
	 * @return {this|number}
	 */
	text(level, x, y, code) {
		return this.map(level, x, y, 'text', code);
	}

	/**
	 * Lecture modification du code physique en x, y
	 * @param level {string} niveau "lower" ou "upper"
	 * @param x {number}
	 * @param y {number}
	 * @param code {number}
	 * @return {this|number}
	 */
	phys(x, y, code) {
		return this.map(level, x, y, 'phys', code);
	}

	/**
	 * Lecture modification de l'offset en x, y
	 * @param level {string} niveau "lower" ou "upper"
	 * @param x {number}
	 * @param y {number}
	 * @param code {number}
	 * @return {this|number}
	 */
	offs(x, y, code) {
		return this.map(level, x, y, 'offs', code);
	}

	/**
	 * Définition d'une nouvelle tile
	 * @param sTile {string}
	 * @param data {*}
	 */
	tile(sTile, data) {
		this._tiles[sTile] = data;
	}

	/**
	 * Définition d'une nouveau blueprint
	 * @param sBP {string}
	 * @param data {*}
	 */
	blueprint(sBP, data) {
		this._blueprints[sBP] = data;
	}

	/**
	 * Ajout d'un tag
	 * @param x {number} coordonnées du tag
	 * @param y {number}
	 * @param tag {string}
	 */
	tag(x, y, tag) {
		this._tags.push({x, y, tag});
	}

	/**
	 * Ajout d'un décal
	 * @param x {number} position du block-mur concerné
	 * @param y {number}
	 * @param side {number} coté du mur 0: nord, 1: est etc...
	 * @param tile {string} référence d'un tile existante dans "tiles"
	 */
	decal(x, y, side, tile) {
		this._decals.push({x, y, side, tile});
	}

	/**
	 * modification d'une option
	 * @param opt {string}
	 * @param val {string}
	 */
	option(opt, val) {
		this._options[opt] = val;
	}

	/**
	 * modification d'une variable visual
	 * @param sVariable {string} nom de la variable
	 * @param x {*} valeur
	 */
	visual(sVariable, x) {
		this._visual[sVariable] = sVariable.toLowerCase().include('color') ? o876.Rainbow.parse(x) : x;
	}

	/**
	 * Définition d'un block-mur
	 */
	wall(xTextures, nFrames, nDelay, nLoop) {
		if (typeof xTextures === 'string') {
			xTextures = [xTextures, xTextures];
		}
		if (nFrames === undefined) {
			this._walls.push(xTextures)
		} else {
			this._walls.push([xTextures, nFrames, nDelay, nLoop]);
		}
	}

	/**
	 * Définition d'un block-sol
	 */
	flat(nFloor, nCeilling) {
		nFloor = nFloor || -1;
		nCeilling = nCeilling || -1;
		this._flats.push([nFloor, nCeilling]);
	}


	/**
	 * générer le JSON
	 * @returns {{map: *, upper: null, visual: {ceilColor: {r: number, g: number, b: number}, fogColor: {r: number, g: number, b: number}, floorColor: {r: number, g: number, b: number}, fogDistance: number, light: number, diffuse: number, filter: boolean}, walls: {src: string, codes: Array}, flats: {src: string, codes: Array}, startpoint: {x: number, y: number, angle: number}, tiles: {}, blueprints: {}, objects: Array, tags: Array, decals: Array, background: null, options: {stretch: boolean}}}
	 */
	render() {
		function cellConvert(c) {
			return (c.offs << 16) | (c.phys << 12) | c.text;
		}

		function rowConvert(row) {
			return row.map(cellConvert);
		}

		function mapConvert(map) {
			return map.map(rowConvert);
		}

		return {
			map: mapConvert(this._map.lower),
			upper: this
				._map
				.lower
				.some(row =>
					row.some(cell => cellConvert(cell) > 0)
				) ? mapConvert(this._map.upper) : null,
			visual: this._visual,
			walls: this._walls,
			flats: this._flats,
			startpoint: this._startpoint,
			tiles: this._tiles,
			blueprints: this._blueprints,
			objects: this._objects,
			tags: this._tags,
			decals: this._decals,
			background: this._background,
			options: this._options
		};
	}
};