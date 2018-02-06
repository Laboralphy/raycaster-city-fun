<template>
    <bordered-card color="rgb(113, 227, 204)" class="game-menu-tab">
        <div class="row">
            <div class="skull">
                <bordered-card
                        v-for="item in equipement"
                        :key="item.emplacement"
                        class="itemSlot col"
                        :class="item.emplacement">
                        <draggable
                                   class="itemWrapper col"
                                   :list="[]"
                                   :options="{group:'inventaire'}"
                                   @add="equiper({emplacement: item.emplacement, idItem: focusedItem.id})"
                                   @remove="handleRanger({emplacement: item.emplacement, idItem: item.item.id}, $event)"
                            >
                            <item v-if="item.item"
                                  :item="item.item"
                                  class=""
                                  @mousemove.native="showFocusedItem(item.item, $event)"
                                  @mouseleave.native="showDesc = false"></item>
                        </draggable>
                </bordered-card>
            </div>
        </div>
        <div class="row">
            <div class="inventory">
                <draggable v-model="inventaire"
                           class="dragArea"
                           :options="{group:'inventaire'}"
                           @start="showDesc=false">
                    <transition-group name="list-complete">
                        <item
                                v-for="item in inventaire"
                                :item="item"
                                :key="item.id"
                                v-if="!item.emplacement"
                                @dblclick.native="equiper({idItem:item.id}); showDesc=false;"
                                @mousemove.native="showFocusedItem(item, $event)"
                                @mouseleave.native="showDesc = false">

                        </item>
                    </transition-group>
                </draggable>
            </div>
        </div>
        <div class="itemInfo" ref="itemInfo" :style="itemInfoStyle">
            <bordered-card v-if="showDesc && focusedItem" >
                <h2 :style="{color: CONST.ITEMS.RARITY[focusedItem.rarity].COLOR}">{{focusedItem.name}}</h2>
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
    import {BorderedCard} from '../../ui';
    import draggable from 'vuedraggable';
    import Item from './Item.vue';

    const { mapState, mapGetters, mapActions } = createNamespacedHelpers('player/inventory');

    export default {
        name: "game-menu-inventory",
        components: {
            BorderedCard,
            draggable,
            Item
        },
        mounted: function() {
            document.body.appendChild(this.$refs['itemInfo']);
        },
        destroyed: function() {
            this.$refs['itemInfo'].remove();
        },
        data: function() {
            return {
                focusedItem: null,
                showDesc: false,
                itemInfoStyle: {
                    top: '25px'
                }
            }
        },
        methods: Object.assign(
            {
                showFocusedItem(item, e) {
                    const mouseOffset = 25;
                    this.itemInfoStyle = {
                        top: (e.clientY + mouseOffset ) +'px'
                    };

                    if (e.clientX >= window.innerWidth * 0.55) {
                        this.itemInfoStyle.left = (e.clientX - this.$refs['itemInfo'].offsetWidth - mouseOffset) +'px';
                    } else {
                        this.itemInfoStyle.left = (e.clientX + mouseOffset) +'px';
                    }

                    this.focusedItem = item;
                    this.showDesc = true;
                },
                handleRanger(info, $event) {
                    if ($event.to.className.indexOf('itemWrapper') === -1) { // changement de slot (pour le cas du changement de main uniquement)
                        this.ranger(info);
                    }
                }
            },
            mapActions({
                'equiper': types.PLAYER_INVENTORY_EQUIPER,
                'ranger' : types.PLAYER_INVENTORY_RANGER
            })
        ),
        computed: Object.assign(
            {
                inventaire: {
                    get() {
                        return this.$store.state.player.inventory.inventaire
                    },
                    set(value) {
                        if (value.length === this.$store.state.player.inventory.inventaire.length) { // On commit uniquement les changements d'ordre, pas les transfèrements
                            this.$store.dispatch('player/inventory/update', value);
                        }
                    }
                }
            },
            mapGetters({
                "equipement": 'getEquipement'
            })
        )
    }
</script>

<style scoped>
    .itemSlot {
        display: block;
        width: 4rem;
        height: 4rem;
        margin: 1rem;
        user-select: none;
        cursor: -webkit-grab;
        cursor: grab;
    }
    .inventory {
        height: calc(30vh - 20px);
    }
    .skull {
        height: calc(50vh - 20px);
    }
    .skull {
        border-bottom: 1px dashed rgb(113, 227, 204);
    }
    .skull .itemSlot {
        position: absolute;
        margin: 0;
    }
    .skull .itemWrapper {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .skull .itemSlot > * {
        transform: scale(0);
    }
    .skull .itemSlot > *:last-child {
        transform: scale(1);
    }
    .skull .itemSlot .item {
        position: absolute;
        top: 0;
        left: 0;
        margin: 0;
    }
    .itemSlot.tete {
        left: calc(50% - 2rem);
    }
    .itemSlot.torse {
        left: calc(50% - 2rem);
        top: 6rem;
    }
    .itemSlot.jambes {
        left: calc(50% - 2rem);
        top: 60%;
    }
    .itemSlot.pieds {
        left: calc(50% - 2rem);
        bottom: 0.5rem;
    }
    .itemSlot.mainDroite {
        top: 45%;
        left:calc(50% - 8rem);
    }
    .itemSlot.mainGauche {
        top: calc(45%);
        right: calc(50% - 9rem);
    }
    .itemInfo {
        position: fixed;
    }
    .itemInfo ul li {
        list-style: none;
    }
    /*Transtion des items*/
    .list-complete-item {
        padding: 4px;
        margin-top: 4px;
        border: solid 1px;
        transition: all 1s;
    }

    .list-complete-enter, .list-complete-leave-active {
        position: absolute;
        transform: scale(0);
    }
</style>