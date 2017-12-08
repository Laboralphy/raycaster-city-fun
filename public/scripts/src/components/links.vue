<template>
    <nav>
        <ul>
            <li v-for="item in items">
                <button v-if="selected === item.caption" class="selected" v-on:click="clickHandler(item)" type="button">{{ item.caption }}</button>
                <button v-else v-on:click="clickHandler(item)" type="button">{{ item.caption }}</button>
            </li>
        </ul>
    </nav>
</template>

<script>
    export default {
        name: "links",
        props: {
            'defSelected': String,
            'defItems': {
                type: Array
            }
        },
        data: function() {
            return {
                selected: this.defSelected,
                items: this.defItems.map(function(i, id) {
                    let oOutput = {
                        caption: '',
                        id: ''
                    };
                    if (typeof i === 'object') {
                        oOutput.caption = i.caption || '';
                        oOutput.id = i.id || ('id-' + id);
                    } else {
                        oOutput.caption = i;
                        oOutput.id = 'id-' + id;
                    }
                    return oOutput;
                })
            };
        },
        methods: {
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