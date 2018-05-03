const path = require('path');
const asyncfs = require('../asyncfs/index');
const fs = require('fs');

const DATA_PATH = 'data';


class ResourceLoader {

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

    loadJSONSync(sDir, sFile) {
        let sJSON = fs.readFileSync(path.resolve(DATA_PATH, sDir, sFile + '.json'), {encoding: 'utf-8'});
        return JSON.parse(sJSON);
    }


	async loadClientData(sPlayer) {
		return {
			...await this.loadJSON('vault/' + sPlayer, 'character'),
			...await this.loadJSON('vault/' + sPlayer, 'location'),
			...await this.loadJSON('vault/' + sPlayer, 'password')
		};
	}

	async loadLevel(sLevel) {
		let level = await this.loadJSON('levels', sLevel);
		//level.tiles = await this.loadJSON('tiles', 'tiles');
		//level.blueprints = await this.loadJSON('blueprints', 'blueprints');
		return level;
	}

    getResourceFolder(type) {
		let fullType;

		switch (type) {
			case 'b':
				fullType = 'blueprints';
				break;

			case 't':
				fullType = 'tiles';
				break;

			default:
				throw new Error('this resource type is unknown : "' + type + "'");
		}
        return fullType;
    }

	/**
	 * Chargement d'une resource JSON
	 * @param type {string} type de resource (b pour blueprint, t pour tile)
	 * @param id {string} identifiant de la resource (genre p_magbolt)
	 * @returns {Promise<*>}
	 */
    async loadResource(type, id) {
		try {
			type = this.getResourceFolder(type);
			if (!(type in this._resources)) {
				this._resources[type] = {};
			}
			if (!(id in this._resources[type])) {
				this._resources[type][id] = await this.loadJSON(type, id);
			}
			return this._resources[type][id];
		} catch (e) {
			throw new Error('could not load resource (type "' + type + '" - id "' + id + '") - ' + e.toString());
		}
	}

    /**
     * Chargement synchrone d'une resource JSON
	 * La ressource doit déja avoir été indexée en mêmoire sinon erreur
     * @param type {string} type de resource (b pour blueprint, t pour tile)
     * @param id {string} identifiant de la resource (genre p_magbolt)
     * @returns {Promise<*>}
     */
    loadResourceSync(type, id) {
        try {
            type = this.getResourceFolder(type);
            if (!(type in this._resources)) {
                this._resources[type] = {};
            }
            if (!(id in this._resources[type])) {
                this._resources[type][id] = this.loadJSONSync(type, id);
            }
            return this._resources[type][id];
        } catch (e) {
            throw new Error('could not synchronously load resource (type "' + type + '" - id "' + id + '") - ' + e.toString());
        }
    }
}

module.exports = ResourceLoader;