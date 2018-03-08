<template>
  <div class="radar">
    <svg :width="size" :height="size" xmlns="http://www.w3.org/2000/svg" v-if="show">
      <defs>
        <clipPath id="outerClip">
          <circle
              :cx="radius"
              :cy="radius"
              :r="radius"/>
        </clipPath>
      </defs>

      <g clip-path="url(#outerClip)">
        <g v-bind="mapProps">
          <template v-for="(row, iRow) in aMap">
            <rect v-for="(cell, iCell) in row" :height="64 * ratio" :width="64 * ratio" :x="iCell * 64 * ratio" :y="iRow * 64 * ratio" :style="'fill:rgb(0,0,'+ (cell < 200 ? 0 : 255) +');'" />
          </template>
        </g>
      </g>

      <g v-if="mapRotation" :transform="'rotate('+ -orientation +' '+ radius +' '+ radius +')'">
        <polygon points="0,-15 -5,0 0,-3 5,0" :transform="'translate('+ radius +' 16)'" style="fill: rgba(227, 190, 88, 0.7)" />
      </g>
      <!--<line x1="0" y1="0" :x2="radius * 2" :y2="radius * 2" style="stroke:rgb(255,0,0);stroke-width:2"/>-->
      <!--<line x1="0" :y1="radius * 2" :x2="radius * 2" y2="0" style="stroke:rgb(255,0,0);stroke-width:2"/>-->
      <path d="m 0,0 -8,-8 q 8 -6 16 0 z" v-bind="visionProps" style="fill: rgba(227, 190, 88, 0.5)"/>
      <circle :cx="radius" :cy="radius" r="5" style="fill: red"/>
    </svg>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      size: 0,
      show: false,
      ratio: 0.2,
      player: {
        x: 0,
        y: 0,
        fTheta: 0
      },
      aMap: [],
      mapRotation: false
    }
  },
  mounted () {
    this.size = this.$el.offsetHeight
    this.$root.$on('game:ready', (game) => {
      this.show = true;
      this.aMap = game.getRaycaster().aMap
    })
    this.$root.$on('game:vsync', (game) => {
      const oPlayer = game.getPlayer()
      this.player = {
        x: oPlayer.x,
        y: oPlayer.y,
        fTheta: oPlayer.fTheta
      }
    })
  },
  computed: {
    radius () {
      return this.size / 2
    },
    /**
     * Retourne la valeur en degre de l'orientation du personnage
     * @returns {number}
     */
    orientation () {
      const fTheta = this.player.fTheta
      return 180 * fTheta / Math.PI
    },
    mapProps () {
      const height = this.aMap.length * 64
      const width = (this.aMap[0] || []).length * 64
      const x = this.player.x
      const y = this.player.y
      const ratio = this.ratio
      const xRatio = this.ratio * x
      const yRatio = this.ratio * y
      let transform = 'translate(' + (-xRatio + this.radius) + ',' + (-yRatio + this.radius) + ') rotate(-90 '+ xRatio  +' '+ yRatio +') ';
      if (this.mapRotation) {
        transform += 'rotate('+ -this.orientation +' '+ xRatio  +' '+ yRatio +')'
      }
      return {
        transform,
        height,
        width
      }
    },
    visionProps () {
      let transform = 'translate('+ this.radius +' '+ this.radius +') scale(5) '
      if (!this.mapRotation) {
        transform += 'rotate('+ this.orientation +')'
      }
      return {
        transform
      }
    }
  }
}
</script>

<style scoped>
  .radar {
    color: red;
    position: fixed;
    top: 0;
    right: 0;
    width: 10rem;
    height: 10rem;
    padding: 0;
    margin: 1rem;
  }

  .radar * {
    padding: 0;
  }
</style>
