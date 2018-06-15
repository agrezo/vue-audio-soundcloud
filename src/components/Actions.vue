<template>
  <!-- Deux boutons prev/next disabled differents pour les tracks paginées et le reste -->
  <ul class="actions">
    <li class="prev" :class="{disabled: list && list.length === 0 || currentTrackIndex <= 0 }" @click="previousTrack()"><img src="./previous.svg" alt="previous track" /></li>
    <li class="play" v-if="!playing && !loading"><img src="./play.svg" alt="play track" @click="play()" /></li>
    <li class="pause" v-if="playing && !loading"><img src="./pause.svg" alt="pause track" @click="pause()"/></li>
    <li class="next" :class="{disabled: list && list.length === 0  || list && currentTrackIndex >= list.length - 1}" @click="nextTrack()"><img src="./next.svg" alt="next track" /></li>
  </ul>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'actions',
    computed: {
      ...mapState({
        currentTrackIndex: state => state.player.currentTrackIndex,
        list: state => state.player.list,
        loading: state => state.player.loading,
        playing: state => state.player.playing,
      })
    },
    methods: {
      ...mapActions('player', [
        'nextTrack',
        'pause',
        'play',
        'previousTrack',
      ]),
    }
  }
</script>

<style lang="stylus" scoped>
  .actions
    display flex
    justify-content space-between
    list-style none
    margin 0
    padding 0
    width 100px
    li
      align-items center
      cursor pointer
      display flex
      &.play
        margin-left 1px
      &.disabled
        opacity 0.3
        cursor default
      &.load
        svg
          display block
          width 22px
          height 22px
          path
            fill #000
      i
        color #000
      
      
</style>