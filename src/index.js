import Player from './Player'

const VueAudioSoundcloud = {}

VueAudioSoundcloud.install = function (Vue) {
  Vue.component('vue-audio-soundcloud', Player)
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueAudioSoundcloud)
}

export default VueAudioSoundcloud