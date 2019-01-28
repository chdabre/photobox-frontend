<template>
    <div class="wrapper">
        <h1 class="header">Settings</h1>
        <div class="settings">
          <h4>Printing</h4>
          <div class="form-group">
            <label class="form-switch">
              <input type="checkbox" v-model="settings.printing.enablePrinting">
              <i class="form-icon"></i> Enable Printing
            </label>
          </div>
          <div class="form-group">
            <label class="form-switch">
              <input type="checkbox" v-model="settings.printing.printNumbers">
              <i class="form-icon"></i> Print Numbers
            </label>
          </div>
          <form class="form-horizontal">
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">Brightness</label>
              </div>
              <div class="col-9 col-sm-12">
                <input class="form-input" type="number" v-model="settings.printing.brightness">
              </div>
            </div>
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">Contrast</label>
              </div>
              <div class="col-9 col-sm-12">
                <input class="form-input" type="number" v-model="settings.printing.contrast">
              </div>
            </div>
          </form>

          <h4>User Interface</h4>
          <form class="form-horizontal">
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">Idle Text</label>
              </div>
              <div class="col-9 col-sm-12">
                <input class="form-input" type="text" v-model="settings.ui.idleText">
              </div>
            </div>
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">Capture Text</label>
              </div>
              <div class="col-9 col-sm-12">
                <input class="form-input" type="text" v-model="settings.ui.captureText">
              </div>
            </div>
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">Error Text</label>
              </div>
              <div class="col-9 col-sm-12">
                <input class="form-input" type="text" v-model="settings.ui.errorText">
              </div>
            </div>
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">Preview time</label>
              </div>
              <div class="col-9 col-sm-12">
                <input class="form-input" type="number" v-model="settings.ui.previewTime">
              </div>
            </div>
          </form>

          <button @click="save" class="btn btn-primary">save</button>
          <button @click="reset" class="btn btn-danger">reset</button>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      settings: null
    }
  },
  methods: {
    save () {
      this.$store.commit('storeSettings', this.settings)
      this.$store.commit('reset')
    },
    reset () {
      this.$store.commit('resetSettings')
      this.$store.commit('loadSettings')
      this.settings = this.$store.state.settings
    }
  },
  created () {
    this.settings = this.$store.state.settings
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
    width: 100%;
    height: 100vh;

    background-color: white;

    display: flex;
    flex-direction: column;
    align-items: center;
}

.header {
    padding-top: 2rem;
}

.settings {
  width: 60%;

  text-align: left;
}
</style>
