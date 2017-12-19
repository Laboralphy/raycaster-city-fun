<template>
    <bordered-card :color="CONST.ITEMS.RARITY[item.rarity].COLOR"
                   class="item col">
        <img :src="'images/inventory/items/'+ item.id +'.png'"/>
    </bordered-card>
</template>

<script>
    import {BorderedCard} from "../../ui/index";
    export default {
        name: "game-menu-inventory-item",
        components: {
            BorderedCard
        },
        props: {
            item: {
                required:true,
                type: Object
            }
        }
    }
</script>

<style scoped>
    .item {
        display: inline-block;
        width: 5rem;
        height: 5rem;
        margin: 1rem;
        user-select: none;
        cursor: -webkit-grab;
        cursor: grab;
    }
    .item:active {
        cursor: -webkit-grabbing;
        cursor: grabbing;
    }
</style>