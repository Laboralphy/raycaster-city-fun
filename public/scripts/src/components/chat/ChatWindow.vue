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
                            v-for="line in getChatContent()"
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
                <form ref="formInput"><input ref="input" type="text" v-model="inputText" :placeholder="STRINGS.ui.chat.placeholder" /></form>
            </div>
        </div>
    </div>
</template>

<script>
    import ChatLine from "./ChatLine.vue";
    import ChatChannels from "./ChatChannels.vue";
    import * as types from '../../store/chat/mutation-types';
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
				getActiveTab: 'chat/getActiveTab'
            })
        ),
        methods: {

        	reset: function() {

            },

            /**
             * Si le canal qu'on consulte actuellement recoit un nouveau message
             * on doit l'afficher en scrollant jusqu'en bas
             * @param idTab
             */
            doScrollDown: function(idTab) {
                if (idTab === this.getActiveTab().id) {
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
                this.$store.dispatch('chat/' + types.CHAT_SELECT_TAB, {id: item.id});
                this.doScrollDown(item.id);
            }).bind(this));
            this.$refs.formInput.addEventListener('submit', event => event.preventDefault());
            // temporaire
            this.$refs.input.addEventListener('keypress', (function(event) {
                switch (event.key) {
                    case 'Enter':
                        this.$emit('message', this.inputText);
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