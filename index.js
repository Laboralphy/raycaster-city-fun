const path = require('path');
const Application = require('./program/index');

const app = new Application();
app.setRoutes(path.resolve(__dirname, 'public'));
app.runService();
app.listen();