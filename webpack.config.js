/**
 * Created by ralphy on 26/05/17.
 */
const path = require('path');

module.exports = {
    entry: {
        app: path.resolve(__dirname, 'public/scripts/src/main.js'),
        test: path.resolve(__dirname, 'public/scripts/test/index.js'),
	},
    output: {
        path: path.resolve(__dirname, 'public/scripts/dist'),
        filename: '[name].js',
        publicPath: "/public/scripts/dist/",
    },
	module: {
		loaders: []
	},
    target: 'web'
};
