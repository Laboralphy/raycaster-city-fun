const express = require('express');
const httpServer = express();
const http = require('http').Server(httpServer);
const io = require('socket.io')(http);
const path = require('path');


const Config = require('./Config');
const logger = require('../Logger');
const Service = require('./services');
const STRINGS = require('./consts/strings');

class Application {

	/**
	 * Lancement du serveur
	 * @returns {Promise<any>}
	 */
	async listen() {
		return new Promise(function(resolve) {
			let nPort = Config.server.port;
			http.listen(nPort, function() {
                logger.log(STRINGS.service.hello);
                logger.log(STRINGS.service.listening, nPort);
				resolve();
			});
		});
	}

	runService() {
        let service = new Service();
        io.on('connection', socket => service.run(socket));
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
        httpServer.get('/raycaster', function(req, res) {
            res.sendFile(path.resolve(sRoot, 'scripts/raycaster/libraycaster.js'));
        });
		httpServer.use(express.static(path.resolve(sRoot, 'resources')));
	}
}


module.exports = Application;
