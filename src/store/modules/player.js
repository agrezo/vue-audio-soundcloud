import axios from 'axios'

export default {
  namespaced: true,
  state: () => ({
    currentTrack: '',
    currentTrackIndex: 0,
    display: false,
    list: [],
    loading: false,
    playing: false,
    widget: '',
  }),
  actions: {
    start ({dispatch}, payload) {
      dispatch('loadTrack', payload)
      dispatch('manageListPlayer', payload)
    },
    manageListPlayer({ commit }, { list, listIndex }) {
      if (!listIndex) return commit('SET_LIST', [])
      commit('SET_LIST', list)
      commit('SET_CURRENT_TRACK_INDEX', listIndex)
    },
    loadTrack ({commit, dispatch}, {track}) {
      commit('LOADING_STATUS', true)
      // axios.get(`https://api.soundcloud.com/tracks/${track.id}?client_id=${process.env.SC_CLIENT_ID}`)
      axios.get(`https://api.soundcloud.com/tracks/${track.id}?client_id=de19e6bf6febe630f4a35b7a78c62ccf`)
        .then(({data}) => {
          commit('time/SET_PROGRESSION', 0, {root: true})
          commit('SET_CURRENT_TRACK', data)
          dispatch('time/setTotalDuration', data.duration, {root: true})
          dispatch('loadWidget', data.uri)
        })
        .catch(() => {
          commit('LOADING_STATUS', false)
        })
    },
    loadWidget({ commit, state, dispatch }, uri) {
      return new Promise((resolve, reject) => {
        state.widget.load(uri, {
          show_artwork: false,
          show_comments: false,
          show_playcount: false,
          show_user: false,
          buying: false,
          sharing: false,
          auto_play: true,
          callback: () => {
            commit('LOADING_STATUS', false)
            commit('PLAYING_STATUS', true)
            state.mute ? state.widget.setVolume(0) : state.widget.setVolume(state.volume)
            resolve()
          }
        })
      })
    },
    play({ commit, state }) {
      if (state.widget && state.currentTrack) {
        state.widget.play()
        commit('PLAYING_STATUS', true)
      }
    },
    pause({ commit, state }) {
      state.widget.pause()
      commit('PLAYING_STATUS', false)
    },
    previousTrack({ commit, dispatch, state }) {
      if (state.list && state.list.length > 0) {
        state.widget.getPosition((position) => {
          const duration = position / 1000
          if (duration > 10) return state.widget.seekTo(0)
          if (state.currentTrackIndex > 0) {
            commit('SET_CURRENT_TRACK_INDEX', state.currentTrackIndex -1)
            dispatch('pause')
            dispatch('loadTrack', { track: state.list[state.currentTrackIndex], index: state.currentTrackIndex })
          }
        })
      }
    },
    nextTrack({ commit, dispatch, state }) {
      if (state.list && state.list.length > 0) {
        if (state.currentTrackIndex >= 0 && state.currentTrackIndex < state.list.length - 1) {
          commit('SET_CURRENT_TRACK_INDEX', state.currentTrackIndex + 1)
          dispatch('pause')
          dispatch('loadTrack', { track: state.list[state.currentTrackIndex], index: state.currentTrackIndex })
        }
      }
    }, 
  },
  mutations: {
    DISPLAY_PLAYER (state) {
      state.display = true
    },
    CREATE_WIDGET (state, payload) {
      state.widget = payload
    },
    SET_CURRENT_TRACK (state, payload) {
      state.currentTrack = payload
    },
    SET_CURRENT_TRACK_INDEX (state, payload) {
      state.currentTrackIndex = payload
    },
    SET_LIST (state, payload) {
      state.list = payload
    },
    LOADING_STATUS(state, payload) {
      state.loading = payload
    },
    PLAYING_STATUS(state, payload) {
      state.playing = payload
    },
    SET_WIDGET_VOLUME(state, payload) {
      state.widget.setVolume(payload)
    },
  }
}