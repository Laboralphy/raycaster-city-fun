<template>
    <nav>
        <ul>
            <li v-for="item in getTabList">
                <button
                    :key="item.id" v-bind:class="(item.id === getActiveTab.id ? 'selected' : '') + ' ' + (item.notified ? 'notify' : '')"
                    v-on:click="clickHandler(item)"
                    type="button">{{ item.caption }}
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
            }
        },
        methods: {
        	add: function(id, sCaption) {
        		if (this.find(id)) {
        			throw new Error('tab id #' + id + ' is already defined');
                }
        		this.items.push({
                    id: id,
                    caption: STRINGS.chat.tabs[sCaption],
                    selected: false,
                    notified: false
                });
            },

            find: function(id) {
        		return this.items.find(i => i.id === id);
            },

            select: function(id, bSelected = true) {
        	    this.items.forEach(t => t.selected = false);
        	    let oTab = this.find(id);
        	    oTab.selected = bSelected;
        	    oTab.notified = false;
            },

            clickHandler: function(item) {
                this.$emit('select', item);
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