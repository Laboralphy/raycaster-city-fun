const fs = require('fs');


/**
 * Transforme la fonction fs.readFile en async
 * de sorte qu'on puisse utiliser comme ceci :
 * let data = await asyncfs.readFile('fichier', {flag: 'r'});
 * parce que async/Await ca trou le cul
 * @param sFile
 * @param options
 * @return {Promise<any>}
 */
async function readFile(sFile, options) {
    return new Promise(resolve => {
        fs.readFile(sFile, options, (err, data) => {
            if (err) {
                resolve(null);
            } else {
                resolve(data);
            }
        });
    });
}



module.exports = {
    readFile
};