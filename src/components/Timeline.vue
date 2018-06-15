<template>
  <div id="timeline">
    <div class="timeline-bar" :style="`width:${progression}%`"></div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'timeline',
    data: () => ({
      isDraggable: false,
    }),
    computed: {
      ...mapState({
        widget: state => state.player.widget,
        progression: state => state.time.progression,
      })
    },
    mounted () {
      this.$nextTick()
        .then(() => {
          this.widget.bind(SC.Widget.Events.READY, () => {
            this.$el.addEventListener('mousedown', (e) => {
              this.isDraggable = true
              this.setTime({e: e, el: this.$el})
            })

            this.$el.addEventListener('mousemove', (e) => {
              if (this.isDraggable) this.setTime({e: e, el: this.$el})
            })

            this.widget.bind(SC.Widget.Events.PLAY_PROGRESS, (data) => {
              this.$store.commit('time/SET_PROGRESSION', data.relativePosition * 100)
            })

            document.addEventListener('mouseup', (e) => {
              this.isDraggable = false
            })
          })
        })
    },
    methods: {
      ...mapActions('time', [
        'setTime',
      ]),
    }
  }
</script>

<style lang="stylus" scoped>
  #timeline
    align-items center
    cursor pointer
    display flex
    flex 1
    height 17px
    margin auto
    position relative
    &:before
      background rgba(#000, .06)
      border-radius 100px
      content ""
      display block
      height 5px
      width 100%
    &:hover
      .timeline-bar
        &:after
          opacity 1
  .timeline-bar
    background blue
    border-radius 100px
    height 5px
    position absolute
    width 0
    &:after
      background #000
      border-radius 100px
      content ""
      height 13px
      opacity 0
      position absolute
      right -7px
      transform translateY(-50%)
      transition all .2s ease-out
      top 50%
      width 13px
</style>