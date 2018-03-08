<template>
  <g>
    <path d="m 0,0 -8,-8 q 8 -6 16 0 z" style="fill: url(#visionGradiant)" transform="scale(5)"></path>
    <circle cx="0" cy="0" r="5" :style="style"></circle>
  </g>
</template>

<script>
export default {
  props: {
    playerData: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  computed: {
    style () {
      const fill = this.playerData.type === 'monster' ? 'red' : 'blue'
      return {
        fill,
      }
    }
  }
}
</script>
