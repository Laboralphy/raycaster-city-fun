<template>
    <bordered-card color="rgb(255, 0, 0)" class="game-menu-tab">
        <svg width="300" height="300">
            <defs>
                <filter id="blur-filter" x="-2" y="-2" width="200" height="200">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                </filter>
            </defs>
            <polygon v-for="n in 9"
                     class="back"
                     :points="getPoint(n)"></polygon>

            <polygon :points="points"
                     class="stats"></polygon>
            <polygon :points="points"
                     class="stats"
                     filter="url(#blur-filter)"></polygon>
        </svg>
    </bordered-card>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    import {BorderedCard, Tabs, Tab} from '../ui';

    const { mapState } = createNamespacedHelpers('player');

    export default {
        name: "game-menu-personnage",
        components: {
            BorderedCard,
            Tabs,
            Tab
        },
        methods: {
            getPoint(n) {
                return generatePoints({
                    STR: n,
                    RES: n,
                    DEX: n,
                    PRE: n,
                    ANA: n
                })
            }
        },
        data: function() {
            return {
                points: generatePoints({
                    STR: 2,
                    RES: 8,
                    DEX: 6,
                    PRE: 2,
                    ANA: 2
                })
            }
        },
        computed: mapState([
            'name',
            'stats'
        ])
    }

    function valueToPoint (value, index, total) {
        const x     = 0
        const y     = -value * 0.9
        const angle = Math.PI * 2 / total * index
        const cos   = Math.cos(angle)
        const sin   = Math.sin(angle)
        const tx    = x * cos - y * sin + 150
        const ty    = x * sin + y * cos + 150
        return { x: tx, y: ty }
    }

    function generatePoints (stats) {
        const aStats = Object.values(stats);
        const total = aStats.length;
        return aStats.map(function (stat, index) {
            const point = valueToPoint(stat * 15, index, total)
            return point.x + ',' + point.y
        }).join(' ')
    }
</script>

<style scoped>
    svg { display: block; }
    polygon.stats {
        fill: transparent;
        stroke: #FF0000;
        stroke-width: 2;
    }
    polygon.back {
        fill: transparent;
        stroke: #FFFFFF;
        stroke-width: 1;
        opacity: 0.25;
    }
</style>