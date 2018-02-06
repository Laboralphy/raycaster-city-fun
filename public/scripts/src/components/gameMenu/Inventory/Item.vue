<template>
    <bordered-card :color="CONST.ITEMS.RARITY[item.rarity].COLOR"
                   class="item">
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
        width: 4rem;
        height: 4rem;
        margin: 0.5rem;
        user-select: none;
        cursor: -webkit-grab;
        cursor: grab;
    }
    .item:active {
        cursor: -webkit-grabbing;
        cursor: grabbing;
    }
</style>