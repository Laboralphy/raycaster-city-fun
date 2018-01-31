<template>
    <div v-show="isVisible" class="chat-window">
        <div class="row">
            <div class="col lg-12">
                <chat-channels ref="channels"></chat-channels>
            </div>
        </div>
        <div class="row">
            <div class="col lg-12">
                <div class="console">
                    <chat-line
                            v-for="line in getChatContent"
                            :key="line.id"
                            :def-uid="line.user ? line.user.id : ''"
                            :def-user="line.user ? line.user.name : ''"
                            :def-color = "line.color"
                            :def-message="line.message"
                    ></chat-line>
                    <br ref="lastItem"/>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col lg-12 input">
                <form ref="formInput"><input ref="input" type="text" v-model="inputText" :placeholder="STRINGS.ui.chat.placeholder" /></form>
            </div>
        </div>
    </div>
</template>

<script>
    import ChatLine from "./ChatLine.vue";
    import ChatChannels from "./ChatChannels.vue";
    import {mapGetters} from 'vuex';

    export default {
        name: "chat-window",
        components: {
            ChatChannels,
            ChatLine,
        },
        data: function() {
            return {
                inputText: '',
                pleaseScrollDown: true,
            };
        },
        computed: Object.assign(
            mapGetters({
                isVisible: 'ui/isVisibleChat',
				getChatContent: 'chat/getContent',
				getActiveTab: 'chat/getActiveTab',
                getLastLine: 'chat/getLastLine',
                getLocalClient: 'clients/getLocalClient'
            })
        ),
        methods: {

        	reset: function() {

            },
        },

        // quand une ligne apparait dans la fenetre de chat active
        // et que cette ligne à été postée par le client local
        updated: function() {
            this.$refs.lastItem.scrollIntoView();
        },

        mounted: function() {
            this.$refs.channels.$on('select', (async function(item) {
                await this.$store.dispatch('chat/selectTab', {id: item.id});
                this.$refs.lastItem.scrollIntoView();
            }).bind(this));
            this.$refs.formInput.addEventListener('submit', event => event.preventDefault());
            // temporaire
            this.$refs.input.addEventListener('keypress', (async function(event) {
                switch (event.key) {
                    case 'Enter':
                        let tab = this.getActiveTab.id;
						await this.$store.dispatch('chat/message', {
						    tab,
                            message: this.inputText
						});
                        this.inputText = '';
                        break;

                    case 'Escape':
                        this.inputText = '';
                        break;
                }
            }).bind(this));
        }
    }
</script>

<style scoped>

    .chat-window {
        width: 40em;
    }

    .console {
        background-color: rgba(128, 64, 0, 0.333);
    }

    input {
        background-color: rgba(128, 64, 0, 0.2);
        color: rgb(255, 128, 64);
        border: solid thin rgb(128, 64, 0);
    }

    .console {
        max-height: 14em;
        height: 14em;
        overflow-y: auto;
    }
</style>