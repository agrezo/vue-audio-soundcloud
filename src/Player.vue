<template>
  <div>
    <iframe id="soundcloud-iframe" width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url="></iframe>
    <slot v-bind="{ 
      currentTrack,
      duration,
      listPosition,
      loop,
      isLoading,
      isLoop,
      isMuted,
      isPlaying,
      next,
      play,
      pause,
      previous,
      progression,
      seekBackward,
      seekForward,
      volume,
    }"></slot>
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