<template>
  <g v-bind="mapProps">
    <template v-for="row in mapDataBloc">
      <template v-for="cell in row" v-if="cell">
        <rect v-bind="cell"></rect>
      </template>
    </template>
    {{mapDataBloc}}
  </g>
</template>

<script>
export default {
  props: {
    ratio: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      aMap: []
    }
  },
  mounted () {
    const oRaycaster = MAIN.game.getRaycaster()
    this.aMap = oRaycaster.aMap.map((r, iR) => r.map((c, iC) => oRaycaster.getMapPhys(iC, iR)))
  },
  computed: {
    mapProps () {
      const height = this.aMap.length * 64
      const width = (this.aMap[0] || []).length * 64
      return {
        height,
        width
      }
    },
    mapDataBloc () {
      const ratio = this.ratio
      return this.aMap.map((r, iRow) => Array.from(r).map((c, iCell) => {
        if (c === this.CONST.RAYCASTER.PHYS_NONE) {
          return false
        } else if (this.CONST.RAYCASTER.PHYS_FIRST_DOOR <= c && c <= this.CONST.RAYCASTER.PHYS_LAST_DOOR) {
          return {
            height: 32 * ratio,
            width: 64 * ratio,
            x: iCell * 64 * ratio,
            y: (iRow * 64 + 16) * ratio,
            style: 'fill:rgb(0,255,0);',
            transform: r[iCell+1] === this.CONST.RAYCASTER.PHYS_NONE ? 'rotate(90 '+ ((iCell * 64 + 32) * ratio) +' '+ ((iRow * 64 + 32) * ratio) +')' : null
          }
        }
        return {
          height: 64 * ratio,
          width: 64 * ratio,
          x: iCell * 64 * ratio,
          y: iRow * 64 * ratio,
          style: 'fill:rgb(0,0,255);'
        }
      }))
    }
  }
}
</script>
