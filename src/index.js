import Player from './Player'

const vueAudioSoundcloud = {}

vueAudioSoundcloud.install = function (Vue) {
  Vue.component('vue-audio-soundcloud', Player)
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(vueAudioSoundcloud)
}

export default vueAudioSoundcloud