<template>
    <div class="bordered-card-root"
         ref="card-root"
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
                <circle v-for="circlesCoord in circlesCoords"
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
        methods: {
            mapperTaille: function() {
                const root = this.$refs['card-root'];
                this.rootWidth = root.offsetWidth;
                this.rootHeight = root.offsetHeight;
            },
            initAnimation: function () {
                let moveSpeed = 4000;
                let nextChange = 0;
                let interpolator = interpolate(this.circlesCoords, newRandomCircles.call(this));
                let vm = this;
                function step(timestamp) {
                    if (timestamp >= nextChange) {
                        nextChange = timestamp + moveSpeed;
                        interpolator = interpolate(vm.circlesCoords, newRandomCircles.call(vm))
                    }
                    vm.circlesCoords = interpolator(1 - (nextChange - timestamp) / moveSpeed);
                    requestAnimationFrame(step);
                }

                requestAnimationFrame(step);
            }
        },
        computed: {
            edgeSize: function() {
                const longer = Math.max(this.rootWidth, this.rootHeight);
                return longer * 0.10;
            }
        },
        data: function() {
            return {
                rootWidth: 0,
                rootHeight: 0,
                circlesCoords: newRandomCircles.call(this)
            }
        },
        mounted: function () {
            this.mapperTaille();
            window.addEventListener('resize', () => {
                this.mapperTaille();
            });
            this.initAnimation();
        },
        updated: function() {
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
        top: -4px;
        left: -2px;
    }
</style>