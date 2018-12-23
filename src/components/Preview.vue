<template>
  <div class="wrapper">
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
  height: 100vh;
}

img {
  min-width: 100%;
  min-height: 100%;
}
</style>
