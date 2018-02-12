import o876 from '../../program/o876';

class AbstractThinker {
	constructor() {
		this._mobile = null;
		this._game = null;
		this._phase = '';
	}

	setPhase(p) {
		this._callIfExists('think' + this._phase + '_exit');
		this._phase = p;
		this._callIfExists('think' + this._phase + '_enter');
	}

	_callIfExists(s, ...args) {
		if (s && (s in this)) {
			this[s](...args);
		}
	}

	think() {
		this._callIfExists('think' + this._phase);
	}
}