/**
 * Thinker d'un personnage controlé par le clavier et la souris.
 */
import AbstractThinker from './AbstractThinker';
import o876 from '../../../../../program/o876';

class FPSThinker extends AbstractThinker {

    constructor() {
        super();
        this.emitter = new o876.Emitter();
        this.oCommands = null;
        this.aKeyBindings = null; // attacher les codes de touches à des évènements symbolique
        this.aKeyBoundList = null; // liste simple des touches qui ont été bindées, pour une indexation rapide
        this._mouseSensitivity = 166;
        this._bFrozen = false;
        this.defineKeys({
            forward : ['z', 'w'],
            backward : 's',
            left : ['q', 'a'],
            right : 'd',
            use : ' '
        });

        MAIN.pointerlock.on('mousemove', event => this.readMouseMovement(event));
        this.setThinker('Active');
    }

    /**
     * proxy vers emitter.on
     * @param sEvent {string} nom de l'évènement
     * @param pHandler {function} handler de l'évènement
     */
    on(sEvent, pHandler) {
        this.emitter.on(sEvent, pHandler);
    }

    /**
     * Associe une touche à une commande
     * @param sKey {string} code de la touche (en es6)
     * @param sEvent {string} nom de l'évènement déclenché quand on appuie/relache la touche
     */
    bindKey(sKey, sEvent) {
        if (this.aKeyBindings === null) {
            this.aKeyBindings = [];
        }
        if (this.aKeyBoundList === null) {
            this.aKeyBoundList = [];
        }
        if (this.oCommands === null) {
            this.oCommands = {};
        }
        this.aKeyBindings[sKey] = [sEvent, 0];
        this.oCommands[sEvent] = false;
        // indexer les touches
        if (this.aKeyBoundList.indexOf(sKey) < 0) {
            this.aKeyBoundList.push(sKey);
        }
    }

    /**
     * Define keys that will be used to control the mobile on which is applied this Thinker
     * @param a {object} is an object matching KEY CODES and Event names
     */
    defineKeys(a) {
        let i, l;
        for (let sEvent in a) {
            if (Array.isArray(a[sEvent])) {
                l = a[sEvent].length;
                for (i = 0; i < l; ++i) {
                    this.bindKey(a[sEvent][i], sEvent);
                }
            } else {
                this.bindKey(a[sEvent], sEvent);
            }
        }
    }

    /**
     * getter pour commands, sensé renvoyer true si la commande est active
     * (touche correspondante enfoncée)
     * @param sEvent {string} nom de l'évènement
     * @returns {*}
     */
    getCommandStatus(sEvent) {
        return this.oCommands[sEvent];
    }

    /**
     * Lecture du device pour rechercher les nouveaux états des touches
     */
    updateKeys() {
        let nKey, sProc, aButton;
        let oCmds = this.oCommands;
        let oKbd = this._game.getKeyboardDevice();
        let aKeyData; // [0] : code touche, [1] : status touche
        let sEvent;
        let kbl = this.aKeyBoundList;
        let kb = this.aKeyBindings;
        for (let iKey = 0, l = kbl.length; iKey < l; ++iKey) {
            nKey = kbl[iKey];
            aKeyData = kb[nKey];
            sEvent = aKeyData[0];
            sProc = '';
            switch (oKbd.getKey(nKey)) {
                case 1: // down
                    if (aKeyData[1] === 0) {
                        sProc = sEvent + '.down';
                        oCmds[sEvent] = true;
                        aKeyData[1] = 1;
                    }
                    break;

                case 2: // Up
                    if (aKeyData[1] === 1) {
                        sProc = sEvent + '.up';
                        oCmds[sEvent] = false;
                        aKeyData[1] = 0;
                    }
                    break;
                default:
                    sProc = '';
                    break;
            }
            if (sProc) {
                this.emitter.trigger(sProc);
            }
        }
        let oMouse = this._game.getMouseDevice();
        while (aButton = oMouse.readMouse()) {
            nKey = aButton[3];
            sEvent = 'button' + nKey;
            sProc = '';
            switch (aButton[0]) {
                case 1: // button down
                    sProc = sEvent + '.down';
                    oCmds[sEvent] = true;
                    break;

                case 0: // button up
                    sProc = sEvent + '.up';
                    oCmds[sEvent] = false;
                    break;

                case 3:
                    sProc = 'wheel.up';
                    break;

                case -3:
                    sProc = 'wheel.down';
                    break;

                default:
                    sProc = '';
                    break;
            }
            if (sProc) {
                this.emitter.trigger(sProc);
            }
        }
        for (sEvent in oCmds) {
            if (oCmds[sEvent]) {
                sProc = sEvent + '.command';
                if (sProc) {
                    this.emitter.trigger(sProc);
                }
            }
        }
    }

    /**
     * lecture de la souris
     * invokée par le pointerlock
     * @param oEvent {PointerLockEvent}
     */
    readMouseMovement(oEvent) {
        if (!this._bFrozen) {
            this._mobile.rotate(oEvent.x / this._mouseSensitivity);
        }
    }

    /**
     * Freezes all movement and rotation
     */
    freeze() {
        this._bFrozen = true;
    }

    /**
     * if frozen then back to normal
     */
    thaw() {
        this._bFrozen = false;
    }

    /**
     * Procedure de pensée
     */
    thinkActive() {
        if (!this._bFrozen) {
            this.updateKeys();
        }
    }
}

export default FPSThinker;