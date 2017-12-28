<template>
    <nav>
        <ul>
            <li v-for="item in getTabList">
                <button
                    v-bind:key="item.id" v-bind:class="(item.id === getActiveTab.id ? 'selected' : '') + ' ' + (item.notified ? 'notify' : '')"
                    v-on:click="clickHandler(item)"
                    type="button">{{ getChannelDisplayName(item.caption) }}
                </button>
            </li>
        </ul>
    </nav>
</template>

<script>
    import STRINGS from '../data/strings';
    export default {
        name: "links",
        computed: {
            getTabList: function() {
                return this.$store.state.chat.tabs;
            },

            getActiveTab: function() {
                return this.$store.state.chat.activeTab;
            },

        },
        methods: {
            clickHandler: function(item) {
                this.$emit('select', item);
            },

            getChannelDisplayName: function(ref) {
                return STRINGS.ui.chat.tabs[ref];
            }
        }
    }
</script>

<style scoped>
    button {
        border: solid 2px transparent;
    }
    button.selected {
        border-color: black
    }
    button.notify {
        background-color: #080;
    }
</style>