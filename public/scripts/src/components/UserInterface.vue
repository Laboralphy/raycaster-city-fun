<template>
  <div>
    <overlay />
    <div v-show="isVisible">
      <login-window ref="login"/>
      <disconnect-window ref="disco"/>
      <chat-window ref="chat"/>
      <game-menu-wrapper ref="gameMenuWrapper"/>
    </div>
  </div>
</template>

<script>
/**
 * Ce composant controle la visibilités des autres composants
 * cela permet de cacher/montrer individuellements les composant de l'ui
 * (chat, inventaire, ....) et de pouvoir cacher/montrer d'un seul coup l'interface
 * en gardant la configuration des composants dans cette interface.
 */


import LoginWindow from './login/LoginWindow.vue'
import DisconnectWindow from './login/DisconnectWindow.vue'
import ChatWindow from './chat/ChatWindow.vue'
import GameMenuWrapper from './gameMenu/GameMenuWrapper.vue'
import Overlay from './overlay/Overlay.vue'

import {mapGetters} from 'vuex'

export default {
  name: 'user-interface',
  components: {
    LoginWindow,
    DisconnectWindow,
    ChatWindow,
    GameMenuWrapper,
    Overlay
  },
  computed: Object.assign(
    mapGetters({
      isVisible: 'ui/isVisible'
    })
  )
}
</script>
