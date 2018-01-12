<template>
    <nav>
        <ul>
            <li v-for="item in tabList">
                <button
                    v-bind:key="item.id" v-bind:class="(activeTab === item.id ? 'selected' : '') + ' ' + (item.notified ? 'notify' : '')"
                    v-on:click="clickHandler(item)"
                    type="button">{{ item.caption }}
                </button>
            </li>
        </ul>
    </nav>
</template>

<script>

    export default {
        name: "links",
        computed: {
            tabList: function() {
                return this.$store.state.chat.tabs;
            },

            activeTab: function() {
                if (this.$store.state.chat.activeTab) {
                    return this.$store.state.chat.activeTab.id;
                } else {
                    return null;
                }
            }
        },
        methods: {
            clickHandler: function(item) {
                this.$emit('select', item);
            }
        }
    }
</script>

<style scoped>
    button {
        border: solid 2px transparent;
        background-color: #884422;
    }
    button.selected {
        border-color: #FF8844;
    }
    button.notify {
        background-color: #080;
    }
</style>