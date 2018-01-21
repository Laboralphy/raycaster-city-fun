const geometry = require('./geometry');
const algorithms = require('./algorithms');
const SpellBook = require('./SpellBook');
const Random = require('./Random');
const Rainbow = require('./Rainbow');
const Emitter = require('./Emitter');
const collider = require('./collider');

module.exports = {

	// namespaces
	algorithms,
	collider,
	geometry,

	// classes
	SpellBook,
	Random,
	Rainbow,
	Emitter
};