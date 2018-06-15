import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import player from './modules/player'
import time from './modules/time'
import volume from './modules/volume'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    player,
    time,
    volume,
  }
})
