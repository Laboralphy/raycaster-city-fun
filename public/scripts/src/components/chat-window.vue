<template>
    <div class="main-window">
        <div class="row">
            <div class="col lg-12">
                <links :def-selected="tab" :def-items="['general', 'mission', 'vicinity']"></links>
            </div>
        </div>
        <div class="row">
            <div class="col lg-12">
                <div class="console">
                    <chat-line
                            :key="line.id"
                            v-for="line in tabs[tab].lines"
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
    import Links from "./links.vue";
    export default {
        name: "chat-window",
        components: {
            Links,
            ChatLine,
        },
        data: function() {
            return {
                idLastLine: 0,
                inputText: '',
                tab: 'general',
                tabs: {
                    general: {
                        lines: [],
                        newline: false
                    },
                    mission: {
                        lines: [],
                        newline: false
                    },
                    viciinity: {
                        lines: [],
                        newline: false
                    }
                }
            };
        },
        methods: {
            write: function(sTab, sUser, sColor, sMessage) {
                if (sTab in this.tabs) {
                    this.tabs[sTab].newline = this.tab !== sTab;
                    this.tabs[sTab].lines.push({
                        id: ++this.idLastLine,
                        tab: sTab,
                        user: sUser,
                        color: sColor,
                        message: sMessage
                    });
                }
            }
        },
        updated: function() {
            this.$refs.lastItem.scrollIntoView();
        },
        mounted: function() {
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