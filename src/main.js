import Vue from 'vue'
import App from './App.vue'
import VueAudioSoundcloud from './index.js'

Vue.use(VueAudioSoundcloud)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
