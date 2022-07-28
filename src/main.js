import Vue from 'vue'
import App from './App.vue'
import store from './store'

import VueNativeSock from 'vue-native-websocket'

Vue.config.productionTip = false

// Vue.use(VueNativeSock, 'ws://' + location.hostname + ':6789', {
Vue.use(VueNativeSock, 'ws://' + 'photoautomat.local' + ':6789', {
  store: store,
  format: 'json',
  reconnection: true, // (Boolean) whether to reconnect automatically (false)
  // reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
  reconnectionDelay: 1000 // (Number) how long to initially wait before attempting a new (1000)
})

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
