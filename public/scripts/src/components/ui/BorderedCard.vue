<template>
    <div class="bordered-card-root"
         :style="'color:'+ color +';'">
        <svg    ref="card-svg"
                :width="rootWidth + 10"
                :height="rootHeight + 10"
                xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                :style="'filter: drop-shadow(0px 0px 10px '+ color +');'">
            <defs>
                <clipPath :id="'cut-off-border'+ _uid">
                    <polygon :points="'0 0, 0 '+ (rootHeight - edgeSize) +', '+ (rootWidth - (rootWidth - edgeSize)) +' '+ rootHeight +', '+ rootWidth +' '+ rootHeight +', '+ rootWidth +' '+ (rootHeight - (rootHeight - edgeSize)) +', '+ (rootWidth - edgeSize) +' 0'"></polygon>
                </clipPath>
            </defs>
                <circle v-for="circlesCoord in animatedCoords"
                        v-bind="circlesCoord"
                        :clip-path="'url(#cut-off-border'+ _uid +')'"
                        fill="transparent"
                        :stroke="color"
                        stroke-opacity="0.2"></circle>
            <polygon :points="'7 7, 7 '+ (rootHeight - edgeSize - 5) +', '+ (rootWidth- (rootWidth - edgeSize) + 5) +' '+ (rootHeight - 5) +', '+ (rootWidth - 5) +' '+ (rootHeight - 5) +', '+ (rootWidth - 5) +' '+ (rootHeight - (rootHeight - edgeSize) + 5) +', '+ (rootWidth - edgeSize - 5) +' 7'"
                     fill="transparent"
                     :stroke="color"
            ></polygon>
            <polygon :points="'2 2, 2 '+ (rootHeight - edgeSize) +', '+ (rootWidth - (rootWidth - edgeSize)) +' '+ rootHeight +', '+ rootWidth +' '+ rootHeight +', '+ rootWidth +' '+ (rootHeight - (rootHeight - edgeSize)) +', '+ (rootWidth - edgeSize) +' 2'"
                     fill="transparent"
                     :stroke="color"
                     stroke-width="4"
            ></polygon>
        </svg>
        <slot />
    </div>
</template>

<script>
    import {interpolate} from 'd3';
    import {TweenLite, Linear} from 'gsap';

    export default {
        name: "bordered-card",
        props: {
            circles: {
                type: Number,
                default: 0
            },
            color: {
                type: String,
                default: 'rgb(227, 190, 88)'
            }
        },
        watch: {
            circlesCoords(newCoords) {
                this.animatedCoords.forEach((circle, index) => {
                    TweenLite.to(
                        circle,
                        this.updateInterval / 1000,
                        Object.assign({ease:Linear.easeNone},newCoords[index])
                    )
                });
            }
        },
        methods: {
            mapperTaille() {
                const root = this.$el;
                this.rootWidth = root.offsetWidth + 2;
                this.rootHeight = root.offsetHeight + 2;
            },
            randomizeCoords() {
                this.circlesCoords = newRandomCircles.call(this);
            },
            initAnimation() {
                this.randomizeCoords();
                setInterval(() => {
                    this.randomizeCoords()
                }, this.updateInterval)
            }
        },
        computed: {
            edgeSize() {
                const longer = Math.max(this.rootWidth, this.rootHeight);
                return longer * 0.10;
            },
            height() {
                return this.$el.outerHeight;
            }
        },
        data: function() {
            return {
                rootWidth: 0,
                rootHeight: 0,
                circlesCoords: newRandomCircles.call(this),
                animatedCoords: newRandomCircles.call(this),
                updateInterval: 10000
            }
        },
        mounted() {
            this.mapperTaille();
            window.addEventListener('resize', () => {
                this.mapperTaille();
            });
            this.initAnimation();
        },
        updated() {
            this.mapperTaille();
        }
    }
    function newRandomCircles() {
        const w = this.rootWidth || 0;
        const h = this.rootHeight || 0;
        let circles = [];
        for (let i = 0; i < this.circles; i++) {
            circles.push({
                cx: Math.ceil(w + Math.random() * (100 - w)),
                cy: Math.ceil(h + Math.random() * (100 - h)),
                r: Math.ceil(h + Math.random() * (100 - h))
            });
        }
        return circles;
    }
</script>

<style scoped>
    .bordered-card-root {
        position: relative;
        transition: all 250ms;
        padding: 10px;
    }
    .bordered-card-root.btn {
        display: inline-block;
        padding: 10px 1rem;
    }
    .bordered-card-root.btn:hover {
        cursor: pointer;
        transform: scale(1.2);
    }
    .bordered-card-root svg {
        position: absolute;
        top: -2px;
        left: -2px;
    }
</style>