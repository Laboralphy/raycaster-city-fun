import o876 from '../../../../../program/o876';

class AbstractThinker {
	constructor() {
		this._mobile = null;
		this._game = null;
		this._phase = '';
	}

    mobile(m) {
        return o876.SpellBook.prop(this, '_mobile', m);
    }

    game(m) {
        return o876.SpellBook.prop(this, '_game', m);
    }

    setThinker(p) {
		this._callThinker('exit');
		this._phase = p;
		this._callThinker('enter');
	}


    /**
	 * Appelle la methode du thinker si elle existe
	 * Le type spécifié correspond à un suffixe de nom de methode
     * @param sType {string}
     * @private
     */
	_callThinker(sType = '') {
		let s = this._phase;
		let sMeth = 'think' + s;
		if (sType) {
			sMeth += '_' + sType;
		}
		if (sMeth in this) {
			this[sMeth]();
		}
	}

    /**
	 * This thinker does absolutly nothing
     */
	thinkNop() {
	}

	think() {
		this._callThinker();
	}
}

export default AbstractThinker;