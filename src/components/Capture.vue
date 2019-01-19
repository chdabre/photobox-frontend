<template>
  <div class="wrapper">
    <div class="camera" @click="startCountdown">
      <video ref="video" class="filter" autoplay></video>
      <div class="bottom-text">
        <transition name="slide-text" mode="out-in">
          <div class="title" :key="'idle'" v-if="pictureState === 'Idle'">{{ idleText }}</div>
          <div class="title medium" :key="'capture'" v-if="pictureState === 'Capture'">{{ captureText }}</div>
          <div class="title" :key="'captureError'" v-if="pictureState === 'Error'">{{ errorText }}</div>

          <div class="title big" :key="countdownText" v-if="pictureState === 'Countdown'">{{ countdownText }}</div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Capture',
  data () {
    return {
      idleText: 'Posieren & Knopf drücken!',
      errorText: 'Noch einmal versuchen!',
      captureText: 'CHEESE!',
      countdownTexts: ['3', '2', '1'],
      pictureState: 'Idle',
      countdownIntervalId: null,
      countdownIndex: 0
    }
  },
  methods: {
    startCountdown () {
      if (this.pictureState === 'Idle' || this.pictureState === 'Error') {
        this.$store.commit('resetCaptureError')
        clearInterval(this.countdownIntervalId)
        this.countdownIndex = 0
        this.countDown()
      }
    },
    countDown () {
      this.pictureState = 'Countdown'
      this.countdownIntervalId = setInterval(() => {
        this.countdownIndex++

        if (this.countdownIndex > this.countdownTexts.length - 1) {
          clearInterval(this.countdownIntervalId)
          this.takePicture()
        }
      }, 1500)
    },
    takePicture () {
      this.pictureState = 'Capture'
      setTimeout(() => {
        this.$store.commit('capture')
      }, 500)
    },
    onMessage (data) {
      var message = JSON.parse(data.data)
      if (message.event === 'buttonPressed') {
        this.startCountdown()
      }
    }
  },
  computed: {
    videoStream () {
      return this.$store.state.videoStream
    },
    captureError () {
      return this.$store.state.captureError
    },
    countdownText () {
      return this.countdownTexts[this.countdownIndex]
    }
  },
  watch: {
    videoStream (stream) {
      this.$refs.video.srcObject = stream
    },
    captureError () {
      if (this.captureError) this.pictureState = 'Error'
    }
  },
  created () {
    this.$options.sockets.onmessage = this.onMessage

    window.addEventListener('keydown', () => {
      this.startCountdown()
    })
  },
  mounted () {
    this.$refs.video.srcObject = this.videoStream
  }
}
</script>

<style scoped lang="scss">
@import '../style/theme.scss';
@import '../style/animations.scss';

.wrapper {
  height: 100vh;
}

.camera {
  position: absolute;
  width: 100%;
  height: 100%;

  overflow: hidden;

  video {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%) scale(-1,1);

    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;

    z-index: -1;
  }
}

.bottom-text {
  position: absolute;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: white;

  opacity: 1;
  overflow: hidden;
  z-index: 1;
}

.filter {
  filter: saturate(125%);
}
</style>
