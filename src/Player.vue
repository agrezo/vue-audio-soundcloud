<template>
  <div class="vue-audio-soundcloud">
    <iframe id="soundcloud-iframe" width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url="></iframe>
    <div class="vue-audio-soundcloud-container">
      <slot v-bind="{ 
        currentDuration,
        isLoading,
        isPlaying,
        next,
        play,
        pause,
        previous,
        progression,
        totalDuration,
        volume,
      }"></slot>
    </div>
  </div>
</template>

<script src="./plugin.js"></script>

<style scoped>
  #soundcloud-iframe {
    left: 99999px;
    position: fixed;
    top: 0;
  }

</style>