import o876 from    '../../../../../program/o876';
import NodeThinker from '../../../../../program/Game/thinkers/Thinker';

class AbstractThinker extends NodeThinker {
	constructor() {
		super();
		this._mobile = null;
		this._game = null;
	}

    mobile(m) {
        return o876.SpellBook.prop(this, '_mobile', m);
    }

    game(m) {
        return o876.SpellBook.prop(this, '_game', m);
    }
}

export default AbstractThinker;