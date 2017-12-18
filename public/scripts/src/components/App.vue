<template>
    <div>
        <chat-window></chat-window>
        <game-menu-wrapper></game-menu-wrapper>
    </div>
</template>

<script>
    import ChatWindow from './chat-window.vue';
    import GameMenuWrapper from './gameMenu/GameMenuWrapper.vue'

    export default {
        components: {
            ChatWindow,
            GameMenuWrapper
        }
    }
</script>