<template>
    <bordered-card class="game-menu-window"
                   :class="{open: isOpen}"
                   :circles="5">
        <tabs ref="game-menu-tabs" :options="{useUrlFragment:false}">
            <tab name="Inventaire">
                <inventory></inventory>
            </tab>
            <tab name="Craft" :is-disabled="true">
                <bordered-card color="rgb(255, 0, 0)" class="game-menu-tab">
                    Ici le composant de gestion du craft
                </bordered-card>
            </tab>
            <tab name="Personnage">
                <personnage></personnage>
            </tab>
        </tabs>
        <bordered-card class="btn close" @click.native="close"><strong>X</strong></bordered-card>
    </bordered-card>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    import * as types from '../../store/modules/gameMenu/mutation-types';
    import {BorderedCard, Tabs, Tab} from '../ui';
    import Inventory from './Inventory/Inventory.vue';
    import Personnage from './Personnage/Personnage.vue';

    const { mapState, mapMutations } = createNamespacedHelpers('gameMenu');

    export default {
        name: "game-menu-wrapper",
        components: {
            BorderedCard,
            Tabs,
            Tab,

            Inventory,
            Personnage
        },
        watch: {
            isOpen(newState) {
                this.$parent.$children.forEach((el) => {
                    if (el !== this) {
                        if (newState) {
                            el.$el.style.filter = 'blur(5px)';
                        } else {
                            el.$el.style.filter = '';
                        }
                    }
                });
            }
        },
        methods: Object.assign(
            {
                selectTab(selectedTabHash) {
                    const elTab = this.$refs['game-menu-tabs'];
                    if (this.isOpen && elTab.activeTabHash !== selectedTabHash) {
                        this.$refs['game-menu-tabs'].selectTab(selectedTabHash);
                    } else {
                        this.$refs['game-menu-tabs'].selectTab(selectedTabHash);
                        this.toggle();
                    }
                }
            },
            mapMutations({
                close: types.GAME_MENU_CLOSE,
                toggle: types.GAME_MENU_TOGGLE
            })
        ),
        computed: Object.assign(
            {},
            mapState([
                'isOpen'
            ])
        ),
        mounted() {
            /*
        	window.addEventListener('keypress', (e) => {
                switch (e.key) {
                    case '²':
                    case 'œ':
                        this.toggle();
                        break;
                    case 'i':
                        this.selectTab('#inventaire');
                        break;
                    case 'c':
                        this.selectTab('#craft');
                        break;
                    case 'p':
                        this.selectTab('#personnage');
                        break;
                }
            });*/

            const elTab = this.$refs['game-menu-tabs'];
            elTab.$on('changed', function() {
                window.dispatchEvent(new Event('resize'));
            })
        }
    }
</script>

<style scoped>

    .game-menu-window {
        position: absolute !important;
        top: 5vh;
        left: 5vw;
        height: 90vh;
        width: 90vw;
        /*border: 1px solid rgb(227, 190, 88);*/
        /*box-shadow:*/
                /*-1px  -1px  5px  rgb(227, 190, 88),*/
                /*-1px  1px 5px rgb(227, 190, 88),*/
                /*1px  1px 5px rgb(227, 190, 88),*/
                /*1px  -1px 5px rgb(227, 190, 88),*/
                /*inset -1px  -1px  5px  rgb(227, 190, 88),*/
                /*inset -1px  1px 5px rgb(227, 190, 88),*/
                /*inset 1px  1px 5px rgb(227, 190, 88),*/
                /*inset 1px  -1px 5px rgb(227, 190, 88);*/
        transition: all 400ms;
        transform: scale(0) rotate(90deg);
    }

    .game-menu-window.open {
        transform: scale(1)  rotate(0deg);
    }

    .game-menu-tab {
        height: 80vh;
    }

    .btn.close {
        position: absolute;
        top: 0;
        right: 0;
        text-align: right;
        color: rgb(113, 227, 204);
        padding: 15px 18px 5px 18px !important;
    }
</style>