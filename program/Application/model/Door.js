/**
 * Cette classe gère les porte et particulièrement le mécanisme de refermeture
 * Permettant de déterminer si le block de cette porte est traversable ou pas
 */


class Door {
    constructor() {
        // offset de la porte 0 = fermé
        this.nOffset = 0;
        // lorsque l'offset atteind cette valeur la porte est traversable
        this.nOffsetOpen = 64;
        // etat de la porte
        // 0:fermé
        // 1:en cours d'ouverture
        // 2:ouvert et traversable
        // 3:en cours de fermeture
        this.nState = 0;
        // si true alors la porte se referme au bout d'un certain délai
        this.bAutoclose = false;
        // delai au bout duquel la porte se referme
        this.nAutocloseDelay = Infinity;
        // temps qui sert a déterminer le moment ou la porte se referme
        // lorsque la valeur tombe à zero, il est temps de refermer la porte
        this.nAutocloseTime = 0;
        // si true alors la porte est vérouillée et ne peut pas s'ouvrir
        this.bLocked = false;
    }

    /**
     * Définir le delai d'auto fermeture de laporte
     * si le délai est Inifini ou  alors l'autoclose est désactivé
     * @param nDelay
     */
    autoclose(nDelay) {
        this.bAutoclose = nDelay !== Infinity;
        this.nAutocloseDelay = nDelay;
    }

    /**
     * Ouvre la porte sauf si celle ci est vérrouillée
     * @return {boolean} résultat de l'opération
     */
    open() {
        if (this.bLocked) {
            return false;
        }
        if (this.nState === 0) {
            if (this.bAutoclose) {
                this.nAutocloseTime = this.nAutocloseDelay;
            }
            this.nState = 1;
            return true;
        }
        return false;
    }

    /**
     * Effectue le traitement automatisé d'une porte
     */
    process() {
        switch (this.nState) {
            case 0: // porte fermée : rien à faire
                break;

            case 1: // porte en cours d'ouverture : s'arreter si l'offset dépasse la valeur max
                if (++this.nOffset >= this.nOffsetOpen) {
                    ++this.nState;
                    if (this.bAutoclose) {
                        this.nAutocloseTime = this.nAutocloseDelay;
                    }
                }
                break;

            case 2: // porte ouvert, entamer la refermeture si c'est une autoclose
                // dont le delai arrive à terme
                if (this.bAutoclose && --this.nAutocloseTime <= 0) {
                    this.nAutocloseTime = 0;
                    ++this.nState;
                }
                break;

            case 3: // en cours de refermeture : réinitialiser l'état quand l'offset atteint 0
                if (--this.nOffset <= 0) {
                    this.nOffset = 0;
                    this.nState = 0;
                }
                break;
        }
    }

    isSolid() {
        return this.nOffset < this.nOffsetOpen;
    }
}

module.exports = Door;