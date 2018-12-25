import Vue from 'vue'
import Vuex from 'vuex'

import Capture from './components/Capture.vue'
import Preview from './components/Preview.vue'

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
    currentScreen: Preview,
    videoStream: null,
    previewUrl: 'http://localhost:8000/0035.jpg',
    previewName: '0035', 
    captureError: false
  },
  mutations: {
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
        state.previewUrl = 'http://localhost:81/' + message.filename
        state.previewName = message.name
      } else if (message.event === 'captureError' && state.currentScreen === Capture) {
        state.captureError = true
        console.log('Capture error: ' + state.error)
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
