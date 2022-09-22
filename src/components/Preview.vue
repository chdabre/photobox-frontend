<template>
  <div class="wrapper">
    <div v-if="!imageLoaded" class="spinner">
      <fulfilling-square-spinner
        :animation-duration="4000"
        :size="50"
        color="#fff"
      />
    </div>

    <div class="title bottom-text">{{ $store.state.settings.ui.bottomText }}</div>
    <div :style="backgroundImageStyle" class="preview-wrapper"></div>
    <canvas ref="printCanvas" height="576" style="display:none" width="864"></canvas>
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
    drawPrintCanvas () {
      var text = this.previewName
      var canvas = this.$refs.printCanvas
      var ctx = canvas.getContext('2d')
      var image = new Image()
      var logoImage = new Image()

      image.crossOrigin = 'anonymous'
      image.src = this.previewUrl

      logoImage.crossOrigin = 'anonymous'
      logoImage.src = '/sichtfeld-logo.png'
      logoImage.addEventListener('load', () => {
        image.addEventListener('load', () => {
          this.imageLoaded = true
          setTimeout(() => {
            this.$store.commit('reset')
          }, this.settings.ui.previewTime)

          ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

          // ctx.drawImage(logoImage, 714, 361, 120, 185)

          if (this.settings.printing.printNumbers) {
            ctx.font = '40px FuturaCustom'
            ctx.fillStyle = 'white'
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 10
            ctx.strokeText(text, 20, canvas.height - 30)
            ctx.fillText(text, 20, canvas.height - 30)
          }

          if (this.settings.printing.enablePrinting) {
            this.$socket.send(JSON.stringify({
              'action': 'print',
              'image': canvas.toDataURL('image/png'),
              'brightness': this.settings.printing.brightness,
              'contrast': this.settings.printing.contrast
            }))
          }
        })
      })
    }
  },
  computed: {
    settings () {
      return this.$store.state.settings
    },
    previewUrl () {
      return this.$store.state.previewUrl
    },
    previewName () {
      return this.$store.state.previewName
    },
    backgroundImageStyle () {
      var style = 'background-image: url("' + this.previewUrl + '");'

      if (!this.imageLoaded) {
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

<style lang="scss" scoped>
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

.bottom-text {
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  font-size: 1.5rem;
  text-shadow: 0px 0px 69px 0px rgba(0, 0, 0, 0.4);
}
</style>
