const express = require('express');
const httpServer = express();
const http = require('http').Server(httpServer);
const io = require('socket.io')(http);
const path = require('path');


const config = require('../Config');
const logger = require('../Logger');
const Service = require('./Service');

class Application {

	/**
	 * Lancement du serveur
	 * @returns {Promise<any>}
	 */
	async listen() {
		return new Promise(function(resolve) {
			let nPort = config.server.port;
			http.listen(nPort, function() {
				logger.log('listening on port ', nPort);
				resolve();
			});
		});
	}

	runService() {
        let service = new Service();
        io.on('connection', function(socket) {
            service.run(socket);
        });
	}

	/**
	 * Definition des routes du server HTTP
	 * @param sRoot {string} répertoir racine
	 */
	setRoutes(sRoot) {
		// root
		httpServer.get('/', function(req, res) {
			res.sendFile(path.resolve(sRoot, 'index.html'));
		});
		// app.js
        httpServer.get('/scripts', function(req, res) {
            res.sendFile(path.resolve(sRoot, 'scripts/dist/app.js'));
        });
		httpServer.use(express.static(path.resolve(sRoot, 'resources')));
	}
}


module.exports = Application;