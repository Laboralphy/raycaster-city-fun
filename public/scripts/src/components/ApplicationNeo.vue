<template>
    <div>
        <h1>Application Neo</h1>
        <button v-on:click="toggleChat" >Chat</button>
        <chat-window ref="chat"></chat-window>
    </div>
</template>

<script>
	import ChatWindow from "./ChatWindow.vue";

	export default {
		components: {ChatWindow},
		name: "application-neo",

        methods: {
			toggleChat: function() {
				this.$refs.chat.visible = !this.$refs.chat.visible;
            }
        }

	}


</script>

<style scoped>

</style>