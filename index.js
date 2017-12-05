const path = require('path');
const Application = require('./program/Application');

const app = new Application();
app.setRoutes(path.resolve(__dirname, 'public'));
app.setSocketHandlers();
app.listen();