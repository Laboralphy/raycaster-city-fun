<template>
    <div class="main-window">
        <div class="row">
            <div class="col lg-12">
                <chat-channels ref="channels"></chat-channels>
            </div>
        </div>
        <div class="row">
            <div class="col lg-12">
                <div class="console">
                    <chat-line
                            v-for="line in consoleContent"
                            :key="line.id"
                            :def-user="line.user"
                            :def-color = "line.color"
                            :def-message="line.message"
                    ></chat-line>
                    <br ref="lastItem"/>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col lg-12 input">
                <form ref="formInput"><input ref="input" type="text" v-model="inputText" /></form>
            </div>
        </div>
    </div>
</template>

<script>
    import ChatLine from "./chat-line.vue";
    import ChatChannels from "./chat-channels.vue";
    import * as types from '../store/mutation-types';


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
        computed: {
            consoleContent: function() {
                return this.$store.getters.chatContent;
            }
        },
        methods: {

            /**
             * Si le canal qu'on consulte actuellement recoit un nouveau message
             * on doit l'afficher en scrollant jusqu'en bas
             * @param idTab
             */
            doScrollDown: function(idTab) {
                if (idTab === this.$store.state.chat.activeTab.id) {
                    this.pleaseScrollDown = true;
                }
            },

        },

        updated: function() {
            if (this.pleaseScrollDown) {
                this.pleaseScrollDown = false;
                this.$refs.lastItem.scrollIntoView();
            }
        },

        mounted: function() {
            this.$refs.channels.$on('select', (function(item) {
                this.$store.dispatch(types.CHAT_SELECT_TAB, {id: item.id})
                this.doScrollDown(item.id);
            }).bind(this));
            this.$refs.formInput.addEventListener('submit', event => event.preventDefault());
            // temporaire
            this.$refs.input.addEventListener('keypress', (function(event) {
                switch (event.key) {
                    case 'Enter':
                        this.$emit('send-message', this.inputText);
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

    .main-window {
        font-size: 10px;
        width: 40em;
        background-color: rgba(0, 0, 0, 0.2);
        border: solid thin black;
    }

    .main-window > div {
        background-color: rgba(0, 0, 0, 0.2);
        border: solid thin black;
    }

    .console {
        background-color: rgba(0, 0, 0, 0.666);
    }

    input {
        background-color: rgba(0, 0, 0, 0.2);
        color: white;
        border: solid thin black;
    }

    .console {
        max-height: 14em;
        height: 14em;
        overflow-y: auto;
    }
</style>