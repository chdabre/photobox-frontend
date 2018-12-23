<template>
  <div class="wrapper" :style="backgroundImageStyle">
    <img :src="previewUrl"/>
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
  },
  computed: {
    previewUrl () {
      return this.$store.state.previewUrl
    },
    backgroundImageStyle () {
      return 'background-image: url(\"' + this.previewUrl + '\");'
    }
  },
  watch: {
  },
  mounted () {
    setTimeout(() => {
      this.$store.commit('reset')
    }, 3000)
  }
}
</script>

<style scoped lang="scss">
@import '../style/theme.scss';

.wrapper {
  width: 100vw;
  height: 100vh;

  background-size: cover;
}
</style>
