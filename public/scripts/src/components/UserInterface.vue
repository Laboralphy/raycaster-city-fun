<template>
    <div v-show="isVisible">
        <login-window ref="login"></login-window>
        <chat-window ref="chat"></chat-window>
        <game-menu-wrapper ref="gameMenuWrapper"></game-menu-wrapper>
    </div>
</template>

<script>
    /**
     * Ce composant controle la visibilités des autres composants
     * cela permet de cacher/montrer individuellements les composant de l'ui
     * (chat, inventaire, ....) et de pouvoir cacher/montrer d'un seul coup l'interface
     * en gardant la configuration des composants dans cette interface.
     */


    import LoginWindow from './login/LoginWindow.vue';
    import ChatWindow from './chat/ChatWindow.vue';
    import GameMenuWrapper from './gameMenu/GameMenuWrapper.vue'

    import {mapGetters} from 'vuex';

    export default {
        name: 'user-interface',
        components: {
            LoginWindow,
            ChatWindow,
            GameMenuWrapper
        },
        computed: Object.assign(
            mapGetters({
                isVisible: 'ui/isVisible'
            })
        ),
        methods: {
            show: function(sWhat) {
                switch (sWhat) {
                    case 'ui':
                        return this.$store.dispatch('ui/show');

                    case 'login':
                        return this.$store.dispatch('clients/show');

                    case 'chat':
                        return this.$store.dispatch('chat/show');

                    case 'inventory':
						return this.$store.dispatch('gameMenu/open');

				}
            },
            hide: function(sWhat) {
                switch (sWhat) {
                    case 'ui':
                        return this.$store.dispatch('ui/hide');

                    case 'login':
                        return this.$store.dispatch('clients/hide');

                    case 'chat':
                        return this.$store.dispatch('chat/hide');

					case 'inventory':
						return this.$store.dispatch('gameMenu/close');

					case '*':
                        return this.$store.dispatch('chat/hide')
                            .then(() => this.$store.dispatch('clients/hide'))
                            .then(() => this.$store.dispatch('gameMenu/close'));
                }
            }
        }
    }
</script>