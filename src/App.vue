<template>
  <div id="app">
    <h1>Vue audio soundcloud</h1>
    <h2>Example of soundcloud audio player</h2>
    <p @click="launchTrack({
      track: {id: item.id},
      list: list,
      index: index,
    })" v-for="(item, index) in list" :key="item.id">{{item.title}}</p>
    <Player>
      <Actions />
      
      <Timeline/>

      <Volume />
    </Player>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import Player from './components/Player.vue'
  import Actions from './components/Actions.vue'
  import Timeline from './components/Timeline.vue'
  import Volume from './components/Volume.vue'

  export default {
    name: 'App',
    components: {
      Player,
      Actions,
      Timeline,
      Volume,
    },
    data: () => ({
      list: [
        {title: 'Valentin Jones - Mission Failed', id: 457792752},
        {title: 'Zombic - Toucan', id: 456109236},
      ]
    }),
    methods: {
      ...mapActions('player', [
        'launchTrack',
      ]),
    }
  }
</script>

<style>
</style>
