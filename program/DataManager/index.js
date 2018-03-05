const DATA_PATH = 'data';
const path = require('path');
const asyncfs = require('../asyncfs/index');

class DataManager {

	constructor() {
		this._resources = {};
	}

    /**
	 * Chargement d'un JSON
     * @param sDir
     * @param sFile
     * @return {Promise<any>}
     */
	async loadJSON(sDir, sFile) {
		let sJSON = await asyncfs.readFile(path.resolve(DATA_PATH, sDir, sFile + '.json'), {encoding: 'utf-8'});
		return JSON.parse(sJSON);
	}

	async loadClientData(sPlayer) {
		return {
			...await this.loadJSON('vault/' + sPlayer, 'location'),
			...await this.loadJSON('vault/' + sPlayer, 'password')
		};
	}

	async loadLevel(sLevel) {
		let level = await this.loadJSON('levels', sLevel);
		level.tiles = await this.loadJSON('tiles', 'tiles');
		level.blueprints = await this.loadJSON('blueprints', 'blueprints');
		return level;
	}

    async loadResources(type) {
        return await this.loadJSON(type, type);
    }

    async loadResource(type, id) {
		if (!(type in this._resources)) {
			this._resources[type] = await this.loadResources(type);
        }
        if (id in this._resources[type]) {
			return this._resources[type][id];
		} else {
			throw new Error('resource not found (type ' + type + ' id ' + id + ')');
		}
	}
}

module.exports = DataManager;