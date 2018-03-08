<template>
  <div class="radar">
    <svg :width="size" :height="size" xmlns="http://www.w3.org/2000/svg" v-if="show">
      <defs>
        <clipPath id="outerClip">
          <circle
              :cx="radius"
              :cy="radius"
              :r="radius">
          </circle>
        </clipPath>
        <radialGradient id="outerMaskGradient">
          <stop offset="0%" stop-color="white" stop-opacity="1"></stop>
          <stop offset="100%" stop-color="white" stop-opacity="0"></stop>
        </radialGradient>
        <mask id="outerMask">
          <circle
              :cx="radius"
              :cy="radius"
              :r="radius"
              fill="url(#outerMaskGradient)"></circle>
        </mask>
        <radialGradient id="visionGradiant" cy="1" r="0.9">
          <stop offset="0%" stop-color="rgb(227, 190, 88)"></stop>
          <stop offset="25%" stop-color="rgb(227, 190, 88)"></stop>
          <stop offset="100%" stop-color="rgba(227, 190, 88, 0)"></stop>
        </radialGradient>
      </defs>

      <g clip-path="url(#outerClip)" mask="url(#outerMask)">
        <rect :width="size" :height="size"></rect>
        <ray-map v-bind="mapProps" :ratio="ratio"></ray-map>
      </g>
      <!-- Cursor NORD -->
      <g v-if="mapRotation" :transform="'rotate('+ -orientation +' '+ radius +' '+ radius +')'">
        <polygon points="0,-15 -5,0 0,-3 5,0" :transform="'translate('+ radius +' 16)'" style="fill: rgb(227, 190, 88)"></polygon>
        <text :x="radius" y="23" style="text-anchor: middle; font-size: 0.5rem; fill: rgb(227, 190, 88);">N</text>
      </g>

      <!-- Croix de debug -->
      <!--<line x1="0" y1="0" :x2="radius * 2" :y2="radius * 2" style="stroke:rgb(255,0,0);stroke-width:2"/>-->
      <!--<line x1="0" :y1="radius * 2" :x2="radius * 2" y2="0" style="stroke:rgb(255,0,0);stroke-width:2"/>-->

      <player :playerData="{}" v-bind="visionProps"></player>
    </svg>
  </div>
</template>

<script>
import Player from './radar/Player.vue'
import RayMap from './radar/RayMap.vue'

export default {
  components: {
    Player,
    RayMap
  },
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
      mapRotation: false
    }
  },
  mounted () {
    this.size = this.$el.offsetHeight
    this.$root.$on('game:ready', () => {
      this.show = true
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
      const x = this.player.x
      const y = this.player.y
      const xRatio = this.ratio * x
      const yRatio = this.ratio * y
      let transform = 'translate(' + (-xRatio + this.radius) + ',' + (-yRatio + this.radius) + ') rotate(-90 '+ xRatio  +' '+ yRatio +') '
      if (this.mapRotation) {
        transform += 'rotate('+ -this.orientation +' '+ xRatio  +' '+ yRatio +')'
      }
      return {
        transform
      }
    },
    visionProps () {
      let transform = 'translate('+ this.radius +' '+ this.radius +') '
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
