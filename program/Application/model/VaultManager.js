const VAULT_LOCATION = 'data/vault';
const path = require('path');
const asyncfs = require('../../asyncfs');
const VAULT_FILES = ['location', 'password'];

class VaultManager {
	async loadVaultJSON(sDir, sFile) {
		return asyncfs.readFile(path.resolve(VAULT_LOCATION, sDir, sFile + '.json'));
	}

	async loadClientData(sPlayer) {
		return new Promise(resolve => {
			let proms = VAULT_FILES.map(f => this.loadVaultJSON(sPlayer, f));
			Promise.all(proms).then(v => {
				let output = {};
				v.forEach(x => {
					output = Object.assign(output, JSON.parse(x));
				});
				resolve(output);
			});
		});
	}
}

module.exports = VaultManager;