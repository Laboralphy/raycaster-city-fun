<template>
    <bordered-card color="rgb(113, 227, 204)" class="game-menu-tab">
        <div class="row">
            <div class="col lg-8 inventory">
                <bordered-card v-for="(item, idItem) in inventaire"
                               :key="idItem"
                                class="item col"
                                @dblclick.native="equiper({idItem:idItem, emplacement:'tete'})">

                    <div class="title">{{item.name}}</div>
                </bordered-card>
            </div>
            <div class="col lg-4 skull">
                <bordered-card v-for="(item, emplacement) in getEquipement"
                               class="item col"
                               :class="emplacement"
                               :key="emplacement">
                    <div class="title">{{emplacement}}</div>
                    <!--{{item ? item.name : 'vide'}}-->
                </bordered-card>
            </div>
        </div>
    </bordered-card>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    import * as types from '../../../store/player/inventory/types';
    import {BorderedCard, Tabs, Tab} from '../../ui';

    const { mapState, mapGetters, mapActions } = createNamespacedHelpers('player/inventory');

    export default {
        name: "game-menu-inventory",
        components: {
            BorderedCard,
            Tabs,
            Tab,
        },
        methods: mapActions({
            'equiper': types.PLAYER_INVENTORY_EQUIPER
        }),
        computed: Object.assign(
            {},
            mapState(['inventaire']),
            mapGetters(['getEquipement'])
        )
    }
</script>

<style scoped>
    .item {
        display: inline-block;
        width: 10vh;
        height: 10vh;
        margin: 1vh;
        user-select: none;
        cursor: -webkit-grab;
        cursor: grab;
    }
    .item:active {
        cursor: -webkit-grabbing;
        cursor: grabbing;
    }
    .item .title {
        position: absolute;
        display: none;
    }
    .item:hover .title {
        display: block;
    }
    .skull, .inventory {
        height: calc(80vh - 20px);
    }
    .skull .item {
        position: absolute;
    }
    .item.tete {
        left: calc(50% - 8.5vh);
    }
    .item.torse {
        left: calc(50% - 8.5vh);
        top: 15%;
    }
    .item.jambes {
        left: calc(50% - 8.5vh);
        top: 50%;
    }
    .item.mainDroite {
        top: 45%;
        left:calc(50% - 20vh);
    }
    .item.mainGauche {
        top: calc(45%);
        right: calc(50% - 20vh);
    }
    .item.pieds {
        left: calc(50% - 8.5vh);
        bottom: 0;
    }
</style>