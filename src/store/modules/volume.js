import axios from 'axios'

export default {
  namespaced: true,
  state: () => ({
    volume: 100,
    mute: false,
  }),
  actions: {
    setVolume({ state, commit }, payload) {
      commit('SET_VOLUME', payload)
      commit('player/SET_WIDGET_VOLUME', state.volume, { root: true })
    },
    muteVolume({ commit }) {
      commit('MUTE_VOLUME')
      commit('player/SET_WIDGET_VOLUME', 0, { root: true })
    },
    unmuteVolume({ state, commit }) {
      commit('UNMUTE_VOLUME')
      commit('player/SET_WIDGET_VOLUME', state.volume, { root: true })
    },
  },
  mutations: {
    SET_VOLUME(state, {e, el}) {
      state.volume = (e.offsetX / el.offsetWidth) * 100
      state.mute = false
    },
    MUTE_VOLUME(state) {
      state.mute = true
    },
    UNMUTE_VOLUME(state) {
      state.mute = false
    },
  }
}