const fs = require('fs');

/**
 * Transforme une fonction fs.readFile en async de sorte qu'on puisse utiliser comme ceci :
 * let data = await asyncfs.readFile('fichier', {flag: 'r'});
 * parce que async/Await ca trou le cul
 * @param sMethod {string} nom de la methode
 * @param args {*} les arguments à passer à la méthode
 * @return {Promise<any>}
 */
function invokeMethod(sMethod, ...args) {
	return new Promise((resolve, reject) => {
		fs[sMethod](...args, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

function readFile(...args) { return invokeMethod('readFile', ...args); }


module.exports = {
    readFile
};