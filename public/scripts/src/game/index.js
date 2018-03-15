import Engine from '../../../../program/engine/client/index';

class Game extends Engine {
    setupListeners() {
        super.setupListeners();
//        this.on('enter', event => this.)
        this.on('level.live.data', data => this.gameEventLevelLiveData(data));
    }

    /*
    déclaration de message du genre waiting for respawn
    si on imagine les joueur pouvant perdre tout leur pv et attendre le respawn
    il faut un plugin au niveau du serveur


    serveur:
    if hp = 0 then transmit G_DEAD


    client:
    ('G_DEAD ... cela se fera dans le plugin game

     */

    /**
     * Exploitation des données vivantes du niveau.
     * ce sont les données structurelles du niveau qui ont été modifiée par les action des joueurs notament
     * il s'agit principâlement des porte ouvertes, des passages secrets trouvés, des coffres vidés etc...
     * @param data
     */
    gameEventLevelLiveData(data) {
        console.log('processing level live data', data);
    }
}

export default Game;