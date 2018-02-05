<template>
    <div>
        <span v-bind:class="'user-name color-' + color" v-if="user">{{user}} : </span>
        <span v-bind:class="'message color-' + color" v-if="message">
            <i v-if="!user">{{message}}</i>
            <span v-else>{{message}}</span>
        </span>
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
        color: #ff8844;
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
        color: #9a9ce4;
    }

</style>