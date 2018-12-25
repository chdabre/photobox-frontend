<template>
  <div class="wrapper" :style="backgroundImageStyle">
    <canvas ref="printCanvas" width="600" height="400"></canvas>
  </div>
</template>

<script>

export default {
  name: 'Preview',
  data () {
    return {
    }
  },
  methods: {
    drawPrintCanvas() {
      var text = this.previewName
      var canvas = this.$refs.printCanvas
      var ctx = canvas.getContext("2d")
      var image = new Image();
      image.crossOrigin='anonymous'
      image.src = this.previewUrl;

      image.addEventListener('load', () => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        ctx.font = '40px monospace'
        ctx.fillStyle = 'white'
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 10
        ctx.strokeText(text, 20, canvas.height - 30)
        ctx.fillText(text, 20, canvas.height - 30)

        console.log(canvas.toDataURL("image/png"))
      })
    }
  },
  computed: {
    previewUrl () {
      return this.$store.state.previewUrl
    },
    previewName () {
      return this.$store.state.previewName
    },
    backgroundImageStyle () {
      return 'background-image: url("' + this.previewUrl + '");'
    }
  },
  watch: {
  },
  mounted () {
    setTimeout(() => {
      // this.$store.commit('reset')
    }, 5000)
    
    this.drawPrintCanvas()
  }
}
</script>

<style scoped lang="scss">
@import '../style/theme.scss';

.wrapper {
  width: 100%;
  height: 100vh;

  background-size: cover;
}
</style>
