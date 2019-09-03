import Vue from 'vue'
import Vuex from 'vuex'

import Capture from './components/Capture.vue'
import Preview from './components/Preview.vue'
import Settings from './components/Settings.vue'

Vue.use(Vuex)

const constraints = window.constraints = {
  audio: false,
  video: {
    width: { exact: 1280 },
    height: { exact: 720 }
  }
}

export default new Vuex.Store({
  state: {
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false
    },
    currentScreen: Capture,
    videoStream: null,
    previewUrl: '',
    previewName: '',
    captureError: false,
    settings: {}
  },
  mutations: {
    resetSettings (state) {
      localStorage.clear()
    },
    loadSettings (state) {
      if (localStorage.settings) {
        state.settings = JSON.parse(localStorage.settings)
      } else {
        state.settings = {
          printing: {
            enablePrinting: true,
            printNumbers: true,
            brightness: 0,
            contrast: -5
          },
          ui: {
            idleText: 'Posieren & Knopf drücken!',
            captureText: 'Cheese!',
            errorText: 'Noch einmal versuchen!',
            bottomText: 'Quittung behalten, die Fotos findest du später auf der Website!',
            previewTime: 8000
          }
        }

        localStorage.settings = JSON.stringify(state.settings)
      }
    },
    storeSettings (state, settings) {
      state.settings = settings
      localStorage.settings = JSON.stringify(state.settings)
    },
    initializeVideoStream (state) {
      if (state.videoStream === null) {
        try {
          navigator.mediaDevices.getUserMedia(constraints).then(stream => {
            state.videoStream = stream
          })
        } catch (e) {
          console.error('Error while trying to get Video stream: ' + e)
        }
      }
    },
    capture (state) {
      Vue.prototype.$socket.send(JSON.stringify({
        'action': 'capture'
      }))
    },
    reset (state) {
      state.currentScreen = Capture
    },
    resetCaptureError (state) {
      state.captureError = false
    },
    SOCKET_ONOPEN (state, event) {
      Vue.prototype.$socket = event.currentTarget
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE (state, event) {
      state.socket.isConnected = false
    },
    SOCKET_ONERROR (state, event) {
      console.error(state, event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE (state, message) {
      state.socket.message = message

      if (message.event === 'imageReady' && state.currentScreen === Capture) {
        state.currentScreen = Preview
        state.previewUrl = 'http://' + location.hostname + ':82/unsafe/1024x768/' + 'http://' + location.hostname + ':81/' + message.filename
        state.previewName = message.name
      } else if (message.event === 'captureError' && state.currentScreen === Capture) {
        state.captureError = true
        console.log('Capture error: ' + state.error)
      } else if (message.event === 'settings') {
        if (state.currentScreen !== Settings) {
          state.currentScreen = Settings
        } else {
          state.currentScreen = Capture
        }
      }
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT (state, count) {
      console.info(state, count)
    },
    SOCKET_RECONNECT_ERROR (state) {
      state.socket.reconnectError = true
    }
  },
  actions: {
    sendMessage (context, message) {
      Vue.prototype.$socket.send(message)
    }
  }
})
