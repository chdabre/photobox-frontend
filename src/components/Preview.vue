<template>
  <div class="wrapper">
    <div class="spinner" v-if="!imageLoaded">
      <fulfilling-square-spinner
        :animation-duration="4000"
        :size="50"
        color="#fff"
      />
    </div>

    <div class="preview-wrapper" :style="backgroundImageStyle"></div>
    <canvas ref="printCanvas" width="600" height="400" style="display:none"></canvas>
  </div>
</template>

<script>
import { FulfillingSquareSpinner } from 'epic-spinners'

export default {
  name: 'Preview',
  components: {
    FulfillingSquareSpinner
  },
  data () {
    return {
      imageLoaded: false
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
        this.imageLoaded = true
        setTimeout(() => {
          this.$store.commit('reset')
        }, 6000)

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        ctx.font = '40px monospace'
        ctx.fillStyle = 'white'
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 10
        ctx.strokeText(text, 20, canvas.height - 30)
        ctx.fillText(text, 20, canvas.height - 30)

        this.$socket.send(JSON.stringify({
          'action': 'print',
          'image': canvas.toDataURL("image/png")
        }))
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
      var style = 'background-image: url("' + this.previewUrl + '");'
      
      if (!this.imageLoaded) {
        style += 'opacity: 0'
      } 
      
      return style
    }
  },
  mounted () {
    this.drawPrintCanvas()
  }
}
</script>

<style scoped lang="scss">
@import '../style/theme.scss';

.wrapper {
  width: 100%;
  height: 100vh;
}

.spinner {
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-wrapper {
  width: 100%;
  height: 100%;
  
  background-size: cover;
  transition: opacity .5s;
}
</style>
