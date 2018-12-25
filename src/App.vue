<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <component :is="currentScreen"></component>
      <div class="spinner" v-if="!currentScreen">
        <fulfilling-square-spinner
          :animation-duration="4000"
          :size="50"
          color="#fff"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { FulfillingSquareSpinner } from 'epic-spinners'

export default {
  name: 'app',
  components: {
    FulfillingSquareSpinner
  },
  data () {
    return {
    }
  },
  computed: {
    currentScreen () {
      if (!this.$store.state.socket.isConnected) {
        return null
      }
      return this.$store.state.currentScreen
    }
  },
  created () {
    this.$store.commit('initializeVideoStream')
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

body {
  overflow: hidden;
}

.spinner {
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
}

@import './style/theme.scss';
@import './style/animations.scss';
</style>
