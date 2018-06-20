import Vue from 'vue'

export default {
  name: 'vue-audio-soundcloud',
  props: ['elements'],
  data: () => ({
    currentTrack: null,
    currentTrackIndex: 0,
    els: {},
    list: [],
    isDraggable: false,
    isLoading: false,
    isMuted: false,
    isPlaying: false,
    progression: 0,
    totalDuration: 0,
    volume: 15,
    widget: null,
  }),
  methods: {
    load ({track, list}) {
      this.isLoading = true
      this.loadList(track, list)
      this.loadTrack(track)
    },
    loadList (track, list) {
      if (!list) return this.list = []
      this.list = list
      this.currentTrackIndex = list.findIndex(item => item.id === track.id)
    },
    loadTrack (track) {
      this.currentTrack = track
      this.progression = 0
      this.totalDuration = track.duration
      this.loadWidget(track)
    },
    loadWidget(track) {
      this.widget.load(track.uri, {
        show_artwork: false,
        show_comments: false,
        show_playcount: false,
        show_user: false,
        buying: false,
        sharing: false,
        auto_play: true,
        callback: () => {
          this.isLoading = false
          this.isPlaying = true
          this.isMuted ? this.widget.setVolume(0) : this.widget.setVolume(this.volume)
        }
      })
    },
    next () {
      if (this.list && this.list.length > 0) {
        if (this.currentTrackIndex >= 0 && this.currentTrackIndex < this.list.length - 1) {
          this.currentTrackIndex = this.currentTrackIndex + 1
          this.pause()
          this.loadTrack(this.list[this.currentTrackIndex])
        }
      }
    }, 
    pause() {
      this.widget.pause()
      this.isPlaying = false
    },
    play () {
      if (this.widget && this.currentTrack) {
        this.widget.play()
        this.isPlaying = true
      }
    },
    previous() {
      if (this.list && this.list.length > 0) {
        this.widget.getPosition((position) => {
          const duration = position / 1000
          if (duration > 10) return this.widget.seekTo(0)
          if (this.currentTrackIndex > 0) {
            this.currentTrackIndex = this.currentTrackIndex - 1
            this.pause()
            this.loadTrack(this.list[this.currentTrackIndex])
          }
        })
      }
    },
  },
  mounted () {
    this.widget = SC.Widget('soundcloud');
    this.els.timeline = document.getElementById(this.elements.timeline)
    this.els.volume = document.getElementById(this.elements.volume)

    Vue.prototype.$player = {}
    Vue.prototype.$player.load = params => this.load(params)
    // Pourquoi pas insérer this.$player dans Vue.prototype avec certaines methods

    this.widget.bind(SC.Widget.Events.READY, () => {
      this.widget.bind(SC.Widget.Events.PLAY_PROGRESS, (data) => {
        this.progression = data.relativePosition * 100
      })

      if (this.els.volume) {
        this.els.volume.addEventListener('mousedown', (e) => {
          this.isDraggable = true
          this.setVolume({ e: e, el: this.els.volume })
        })
        this.els.volume.addEventListener('mousemove', (e) => {
          if (this.isDraggable) this.setVolume({ e: e, el: this.els.volume })
        })
      }

      if (this.els.timeline) {
        this.els.timeline.addEventListener('mousedown', (e) => {
          this.isDraggable = true
          this.setTime({ e: e, el: this.els.timeline })
        })

        this.els.timeline.addEventListener('mousemove', (e) => {
          if (this.isDraggable) this.setTime({ e: e, el: this.els.timeline })
        })
      }

      document.addEventListener('mouseup', (e) => {
        this.isDraggable = false
      })
    })
  },
  beforeDestoy() {
    // this.widget.unbind()
  }
}