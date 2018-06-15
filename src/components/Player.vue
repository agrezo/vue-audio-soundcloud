<template>
  <div class="sd-player">
    <iframe id="soundcloud" width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/234427625&amp;color=%23ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false&amp;visual=false&amp;show_playcount=false&amp;show_artwork=false&amp;sharing=false&amp;buying=false"></iframe>

    <!-- Player desktop -->
    <div class="sd-player-area">
      <Actions />
      
      <div class="current-track">
        <!-- <img v-if="Object.keys($store.state.player.current).length > 0" :src="$store.state.player.current.artwork_url" alt=""> -->
        <div>
          <div class="current-track-text" v-if="Object.keys(currentTrack).length > 0">
            <div class="flex">
              <h3>{{currentTrack.title}}</h3>
              <p class="current-track-text-user">{{currentTrack.user.username}}</p>
            </div>
            <!-- <p class="time">{{$store.state.player.currentDuration}} / {{$store.state.player.totalDuration}}</p> -->
          </div>
  
          <Timeline/>
        </div>
      </div>
      
      <div class="actions-right">
        <Volume />
      </div>  
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Actions from './Actions.vue'
  import Timeline from './Timeline.vue'
  import Volume from './Volume.vue'

  export default {
    name: 'vue-audio-soundcloud',
    components: {
      Actions,
      Timeline,
      Volume,
    },
    data: () => ({
      currentTrack: {}
    }),
    mounted () {
      this.$store.commit('player/CREATE_WIDGET', SC.Widget('soundcloud'))
      // this.$store.commit('player/CREATE_WIDGET', SC.Widget('soundcloud'))
    },

  }
</script>

<style lang="stylus" scoped>
  .sd-player
    width 800px
    iframe
      position fixed
      top 0
      left 99999px
    .sd-player-area
      z-index 10
      width 100%
      background #eee
      height 60px
      display flex
      align-items center
      padding 0 20px

      .actions
        width 100px
        display flex
        justify-content space-between
        list-style none
        li
          display flex
          align-items center
          cursor pointer
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
    
      .current-track
        flex 1
        display flex
        align-items center
        padding 0 20px
        img
          display block
          height 40px
          margin-right 20px
        & > div
          flex 1
          padding-right 25px
          .current-track-text
            display flex
            justify-content space-between
            margin-bottom 2px
            .flex
              display flex
              align-items baseline
              .current-track-text-user
                font-size 11px
                color #aaa
                letter-spacing .2px
                &:hover
                  text-decoration undeerline
              h3
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
                font-weight 400
                font-size 13px
                letter-spacing .2px
                margin-right 10px
                color #000
                a
                  display block
                  color #000
                  &:hover
                    text-decoration underline
          #timeline
            position relative
            display flex
            align-items center
            flex 1
            height 17px
            margin auto
            cursor pointer
            &:before
              content ""
              display block
              background rgba(#000, .06)
              width 100%
              height 5px
              border-radius 100px
            &:hover
              .timeline-progress
                &:after
                  opacity 1
            .timeline-progress
              position absolute
              background $main
              width 0
              height 5px
              border-radius 100px
              &:after
                opacity 0
                content ""
                position absolute
                right -7px
                top 50%
                transform translateY(-50%)
                width 13px
                height 13px
                border-radius 100px
                background #000
                transition all .2s ease-out
                -webkit-transition all .2s ease-out
                -moz-transition all .2s ease-out
          
          .time
            font-size 12px
            white-space nowrap
            color #000

      .actions-right
        display flex
        align-items center
        .download
          display flex
          align-items center
          height 40px
          margin-left 20px
          a
            height 24px
            color #000
        .volume
          position relative
          width 30px
          height 40px
          display flex
          align-items center
          justify-content center
          cursor pointer
          color #000
          &:hover
            & > div 
              display flex
          i
            display block
            font-size 22px
          & > div
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
                position absolute
                left 0
                background $main
                width 30%
                height 4px
                border-radius 100px
                &.muted
                  width 0 !important

  @media (max-width: 768px)
    .sd-player
      display none
</style>