const o876 = require('../../o876/index');
module.exports = class Thinker {
	constructor() {
		this._state = 'idle';
		this._duration = 0;
		this._nextState = 'idle';
		this._mobile = null;
	}

	mobile(m) {
		return o876.SpellBook.prop(this, '_mobile', m);
	}

    /**
	 * Invoke un methode si elle est présente dans l'instance
     * @param sMeth
     */
	invoke(sMeth) {
		if (sMeth in this) {
			this[sMeth]();
		}
	}

    /**
	 * Définit un état idle
     */
	idle() {
		this.state('idle');
	}

    /**
	 * Permet de définir la durée de l'état avant de repasser à un autre état
     * @param n {number}
     */
	duration(n) {
		return o876.SpellBook.prop(this, '_duration', n);
	}

    /**
	 * Le prochain ettat une fois que celui en cour sera terminé
     * @param s
     * @return {*}
     */
	next(s) {
        return o876.SpellBook.prop(this, '_next', s);
	}

    /**
	 * modification de l'état
     * @param s {string}
     */
    state(s) {
        this._duration = Infinity;
        this._nextState = 'idle';
        this.invoke('$' + this._state + '_exit');
        this._state = s;
        this.invoke('$' + this._state + '_enter');
        return this;
    }

	think() {
		this.invoke('$' + this._state);
		if (--this._duration <= 0) {
			this.state(this.next());
			this.next('idle');
		}
	}


	$idle() {

	}
};