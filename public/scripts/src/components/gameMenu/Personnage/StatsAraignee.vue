<template>
    <div>
        <h3 class="text-center">Statistiques</h3>
        <svg width="300" height="300">
            <polygon v-for="n in 9"
                     class="back"
                     :points="getPoint(n)"></polygon>

            <polygon :points="points"
                     class="stats"></polygon>

            <g v-for="(stat, stName, i) in stats">
                <line x1="150" y1="150"
                    :x2="getCoord(9)[i].x" :y2="getCoord(9)[i].y"></line>
                <text
                      text-anchor="middle"
                      transform="translate(0, 5)"
                      fill="red"
                      v-bind="getCoord(10.3)[i]">{{ stName }}</text>
                <circle r="5" v-bind="{cx: getCoord(stat)[i].x, cy: getCoord(stat)[i].y}"></circle>
            </g>


        </svg>
    </div>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';

    const { mapState } = createNamespacedHelpers('player');

    export default {
        name: "game-menu-personnage-stats-araignee",
        methods: {
            getCoord(n) {
                return generatePoints({
                    STR: n,
                    RES: n,
                    DEX: n,
                    PRE: n,
                    ANA: n
                });
            },
            getPoint(n) {
                return this.getCoord(n).map((p) => { return p.x + ',' + p.y }).join(' ');
            }
        },
        computed: Object.assign(
            {
                points: function() {
                    return this.dots.map((p) => { return p.x + ',' + p.y
                    }).join(' ');
                },
                dots: function() {
                    return generatePoints(this.stats);
                }
            },
            mapState([
                'stats'
            ])
        )
    }

    function valueToPoint (value, index, total) {
        const x     = 0;
        const y     = -value * 0.9;
        const angle = Math.PI * 2 / total * index;
        const cos   = Math.cos(angle);
        const sin   = Math.sin(angle);
        const tx    = x * cos - y * sin + 150;
        const ty    = x * sin + y * cos + 150;
        return { x: tx, y: ty };
    }

    function generatePoints (stats) {
        const aStats = Object.values(stats);
        const total = aStats.length;
        return aStats.map(function (stat, index) {
            return valueToPoint(stat * 15, index, total);
        });
    }
</script>

<style scoped>
    svg {
        display: block;
        margin: auto;
        filter: drop-shadow(0 0 10px);
    }
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
    circle {
        fill: #FF0000;
    }
    line {
        stroke: #FFFFFF;
        opacity: 0.25;
    }
</style>