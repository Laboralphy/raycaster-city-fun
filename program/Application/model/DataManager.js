const DATA_PATH = 'data';
const path = require('path');
const asyncfs = require('../../asyncfs');

class DataManager {

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
		return await this.loadJSON('levels', sLevel);
	}
}

module.exports = DataManager;