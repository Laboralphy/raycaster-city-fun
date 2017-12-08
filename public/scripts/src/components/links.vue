<template>
    <nav>
        <ul>
            <li v-for="item in items">
                <button
                    :key="item.id" v-bind:class="(item.selected ? 'selected' : '') +' ' + (item.notified ? 'notify' : '')"
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
        props: {
        },
        data: function() {
            return {
                items: []
            };
        },
        methods: {
        	add: function(id, sCaption) {
        		if (this.find(id)) {
        			throw new Error('tab id #' + id + ' is already defined');
                }
        		this.items.push({
                    id: id,
                    caption: sCaption,
                    selected: false,
                    notified: false
                });
            },

            find: function(id) {
        		return this.items.find(i => i.id === id);
            },

            select: function(id, bSelected = true) {
                this.find(id).selected = bSelected;
            },

            clickHandler: function(item) {
                this.$emit('select', item);
            }
        }
    }
</script>

<style scoped>
    button.selected {
        border: solid 2px black
    }
    button.notify {
        background-color: #0F0;
    }
</style>