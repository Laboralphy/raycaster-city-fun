<template>
    <div>
        <span v-bind:class="'user-name color-' + color" v-if="user">{{user}} : </span>
        <span v-bind:class="'message color-' + color" v-if="message">{{message}}</span>
    </div>
</template>

<script>
    export default {
        name: "chat-line",
        props: ['defUser', 'defColor', 'defMessage'],
        data: function() {
            return {
                user: this.defUser,
                color: this.defColor,
                message: this.defMessage
            }
        }
    }
</script>

<style scoped>
    .user-name {
        font-weight: bold;
    }
    span {
        text-shadow: 1px 1px 0 #000;
    }
    .color-0 {
        color: #6c6dff;
    }
    .color-1 {
        color: #5cff4e;
    }
    .color-2 {
        color: #ff646b;
    }
    .color-3 {
        color: #fff967;
    }
    .color-4 {
        color: #ff63fa;
    }
    .color-5 {
        color: #62f8ff;
    }
    .color-6 {
        color: #a5a2a2;
    }

</style>