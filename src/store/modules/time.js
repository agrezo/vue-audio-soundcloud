export default {
  namespaced: true,
  state: () => ({
    currentDuration: '0:00',
    progression: 0,
    totalDuration: 0,
  }),
  actions: {
    setCurrentDuration({ commit, dispatch }, payload) {
      dispatch('formatTime', payload)
        .then(data => {
          commit('SET_CURRENT_DURATION', data)
        })
    },
    setTime({rootState}, {e, el}) {
      rootState.player.widget.getDuration(duration => {
        rootState.player.widget.seekTo(parseInt(e.offsetX / el.offsetWidth * duration))
      })
    },
    setTotalDuration({ commit, dispatch }, payload) {
      dispatch('formatTime', payload)
        .then(data => {
          commit('SET_TOTAL_DURATION', data)
        })
    },
    // formatTime({}, payload) {
    formatTime(payload) {
      return new Promise((resolve) => {
        payload = payload / 1000.0
        const mins = ~~((payload % 3600) / 60)
        const secs = (payload % 60).toFixed(0)
        const ret = `${mins}:${(secs < 10 ? '0' : '')}${secs}`
        resolve(ret)
      })
    }
  },
  mutations: {
    SET_PROGRESSION(state, payload) {
      state.progression = payload
    },
    SET_CURRENT_DURATION(state, payload) {
      state.currentDuration = payload
    },
    SET_TOTAL_DURATION(state, payload) {
      state.totalDuration = payload
    },
  }
}