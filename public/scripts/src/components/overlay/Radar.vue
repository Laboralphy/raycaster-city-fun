<template>
  <div class="radar">
    <svg :width="size" :height="size" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="outerClip">
          <circle
              :cx="radius"
              :cy="radius"
              :r="radius"/>
        </clipPath>
      </defs>

      <g clip-path="url(#outerClip)">
        <rect :x="radius" :y="radius" v-bind="mapProps"/>

      </g>
    </svg>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      size: 0,
      player: {
        x: 0,
        y: 0,
        fTheta: 0
      },
      aMap: []
    }
  },
  mounted () {
    this.size = this.$el.offsetHeight
    this.$root.$on('game:ready', (game) => {
      this.aMap = game.oRaycaster.aMap
    })
    this.$root.$on('game:doomloop', (game) => {
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
    mapProps () {
      const height = this.aMap.length * 64
      const width = (this.aMap[0] || []).length * 64
      const x = this.player.x
      const y = this.player.y
      return {
        transform: 'translate(-' + x + ',-' + y + ')',
        height,
        width
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
  }

  .radar * {
    padding: 0;
  }
</style>
