<template>
  <div class="vue-audio-soundcloud">
    <iframe id="soundcloud" width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url="></iframe>
    <div class="vue-audio-soundcloud-container">
      <slot v-bind="{play, pause, previous, next, progression}"></slot>
    </div>
  </div>
</template>

<script src="./plugin.js"></script>

<style lang="stylus" scoped>
  .vue-audio-soundcloud
    iframe
      position fixed
      top 0
      left 99999px
  .vue-audio-soundcloud-container
    z-index 10
    width 100%
    background #eee
    height 60px
    display flex
    align-items center
    padding 0 20px

</style>