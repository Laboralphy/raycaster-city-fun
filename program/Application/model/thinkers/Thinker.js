class Thinker {
	constructor() {
		this._state = 'idle';
	}

	invoke(sMeth) {
		if (sMeth in this) {
			this[sMeth]();
		}
	}

	think() {
		this.invoke('$' + this._state);
	}

	state(s) {
		this.invoke('$' + this._state + '_exit');
		this._state = s;
		this.invoke('$' + this._state + '_enter');
	}

	$idle() {

	}
}