<template>
    <bordered-card color="rgb(113, 227, 204)" class="game-menu-tab">
        <div class="row">
            <div class="col lg-8 inventory">
                <draggable v-model="inventaire" @start="focusedItem=null">
                    <transition-group>
                        <bordered-card v-for="item in inventaire"
                                       v-if="!item.emplacement"
                                       :key="item.id"
                                       :color="CONST.ITEMS[item.rarity].COLOR"
                                       class="item col"
                                       @dblclick.native="equiper({idItem:item.id, emplacement:'tete'})"
                                       @mousemove.native="showFocusedItem(item, $event)"
                                       @mouseleave.native="focusedItem = null">
                            <img :src="'images/inventory/items/'+ item.id +'.png'"/>
                        </bordered-card>
                    </transition-group>
                </draggable>
            </div>
            <div class="col lg-4 skull">
                <bordered-card v-for="(item, emplacement) in equipement"
                               class="item col"
                               :class="emplacement"
                               :key="emplacement">
                <!--{{item ? item.name : 'vide'}}-->
                </bordered-card>
            </div>
        </div>
        <div class="itemInfo" :style="itemInfoStyle">
            <bordered-card v-if="focusedItem" >
                <h2 :style="{color: CONST.ITEMS[focusedItem.rarity].COLOR}">{{focusedItem.name}}</h2>
                <div v-if="focusedItem.props">
                    Propriétés :
                    <ul>
                        <li v-for="(val,prop) in focusedItem.props"
                            :style="CONST.PROPS[prop]">
                            {{prop}} : {{val}}
                        </li>
                    </ul>
                </div>
                <div v-if="focusedItem.stats">
                    Statistiques :
                    <ul>
                        <li v-for="(val,stat) in focusedItem.stats"
                            :style="CONST.STATS[stat]">
                            {{stat}} : {{val}}
                        </li>
                    </ul>
                </div>
            </bordered-card>
        </div>
    </bordered-card>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    import * as types from '../../../store/player/inventory/types';
    import {BorderedCard, Tabs, Tab} from '../../ui';
    import draggable from 'vuedraggable';

    const { mapState, mapGetters, mapActions } = createNamespacedHelpers('player/inventory');

    export default {
        name: "game-menu-inventory",
        components: {
            BorderedCard,
            Tabs,
            Tab,
            draggable
        },
        data: function() {
            return {
                focusedItem: null,
                itemInfoStyle: {
                    top: '25px'
                }
            }
        },
        methods: Object.assign(
            {
                showFocusedItem(item, e) {
                    this.itemInfoStyle = {
                        top: e.clientY +'px',
                        left: e.clientX +'px',
                    };
                    this.focusedItem = item;
                }
            },
            mapActions({
                'equiper': types.PLAYER_INVENTORY_EQUIPER
            })
        ),
        computed: Object.assign(
            {
                inventaire: {
                    get() {
                        return this.$store.state.player.inventory.inventaire
                    },
                    set(value) {
                        this.$store.commit('player/inventory/update', value)
                    }
                },
                equipement: {
                    get() {
                        return this.$store.getters['player/inventory/getEquipement'];
                    },
                    set(value) {
                        this.$store.commit('player/inventory/update', value)
                    }
                }
            },
        )
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
    .skull, .inventory {
        height: calc(80vh - 20px);
    }
    .skull {
        border-left: 1px dashed rgb(113, 227, 204);
    }
    .skull .item {
        position: absolute;
        margin: 0;
    }
    .item.tete {
        left: calc(50% - 2.5rem);
    }
    .item.torse {
        left: calc(50% - 2.5rem);
        top: 7.5rem;
    }
    .item.jambes {
        left: calc(50% - 2.5rem);
        top: 50%;
    }
    .item.pieds {
        left: calc(50% - 2.5rem);
        bottom: 1rem;
    }
    .item.mainDroite {
        top: 45%;
        left:calc(50% - 8.5rem);
    }
    .item.mainGauche {
        top: calc(45%);
        right: calc(50% - 9.5rem);
    }
    .itemInfo {
        position: fixed;
    }
    .itemInfo ul li {
        list-style: none;
    }
</style>