<template>
    <div>
        <chat-window></chat-window>
        <game-menu-wrapper></game-menu-wrapper>
    </div>
</template>

<script>
    import ChatWindow from './ChatWindow.vue';
    import GameMenuWrapper from './gameMenu/GameMenuWrapper.vue'

    export default {
        components: {
            ChatWindow,
            GameMenuWrapper
        }
    }
</script>