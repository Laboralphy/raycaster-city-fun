const asyncfs = require('../asyncfs');
const path = require('path');
const logger = require('../Logger');

/**
 * Chargement d'un niveau
 * @param sLevel
 * @return {Promise<any>}
 */
async function load(sLevel) {
    return new Promise(async resolve => {
        let sFileName = path.resolve(__dirname, sLevel + '.json');
        let res = await asyncfs.readFile(sFileName, {flag: 'r'});
        if (res) {
            resolve(JSON.parse(res));
        } else {
            resolve(null);
        }
    });
}


module.exports = {
    load
};