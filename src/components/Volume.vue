<template>
  <div class="volume">
    <img src="./volume-mute.svg" alt="low volume" @click="unmuteVolume()" v-if="mute || volume <= 0" />
    <img src="./volume-full.svg" alt="max volume" @click="muteVolume()" v-else-if="volume > 0" />
    <div class="volume-box">
      <div class="volume-bar" id="volume">
        <div class="volume-bar-progress" :style="`width:${volume}%`" :class="{muted: mute}"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'volume',
    data: () => ({
      el: {},
      isDraggable: false,
    }),
    computed: {
      ...mapState({
        mute: state => state.volume.mute,
        volume: state => state.volume.volume,
        widget: state => state.player.widget,
      })
    },
    mounted () {
      this.el = document.getElementById('volume')

      this.$nextTick()
        .then(() => {
          this.widget.bind(SC.Widget.Events.READY, () => {
            this.el.addEventListener('mousedown', (e) => {
              this.isDraggable = true
              this.setVolume({e: e, el: this.el})
            })
            this.el.addEventListener('mousemove', (e) => {
              if (this.isDraggable) this.setVolume({e: e, el: this.el})
            })
            document.addEventListener('mouseup', (e) => {
              this.isDraggable = false
            })
          })
        })
    },
    methods: {
      ...mapActions('volume', [
        'setVolume',
        'muteVolume',
        'unmuteVolume',
      ]),
    }
  }
</script>

<style lang="stylus" scoped>
  .volume
    align-items center
    color #000
    cursor pointer
    display flex
    height 40px
    justify-content center
    position relative
    width 30px
    &:hover
      & > div 
        display flex
    i
      display block
      font-size 22px

  .volume-box
    display none
    position absolute
    bottom calc(100% + 48px)
    left -50px
    height 30px
    width 130px
    background #fff
    align-items center
    justify-content center
    transform rotate(90deg)
    box-shadow 0 0 10px rgba(0,0,0,0.1), 0 0 10px rgba(0,0,0,0.16)

  .volume-bar
    position relative
    display flex
    align-items center
    width 105px
    height 30px
    transform rotate(180deg)
    &:before
      content ""
      display block
      background rgba(#000, .06)
      width 100%
      height 4px
      border-radius 100px

  .volume-bar-progress
    background blue
    border-radius 100px
    height 4px
    left 0
    position absolute
    &.muted
      width 0 !important
</style>