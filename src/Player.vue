<template>
  <div class="vue-audio-soundcloud">
    <iframe id="soundcloud" width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url="></iframe>
    <div class="vue-audio-soundcloud-container">
      <slot v-bind="{play, pause, previous, next, progression, volume,}"></slot>
    </div>
  </div>
</template>

<script src="./plugin.js"></script>

<style scoped>
  .vue-audio-soundcloud iframe {
    left: 99999px;
    position: fixed;
    top: 0;
  }
  .vue-audio-soundcloud-container {
    background: #eee;
    display: flex;
  }
</style>