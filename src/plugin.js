import Vue from 'vue'

export const convertTimeHHMMSS = (val) => {
  let hhmmss = new Date(val * 1000).toISOString().substr(11, 8)
  return (hhmmss.indexOf('00:') === 0) ? hhmmss.substr(3) : hhmmss
}

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
    loadWidget (track) {
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
    mute () {
      this.isMuted = false
    },
    next () {
      if (this.list && this.list.length > 0 && this.currentTrackIndex >= 0 && this.currentTrackIndex < this.list.length - 1) {
        this.currentTrackIndex = this.currentTrackIndex + 1
        this.pause()
        this.loadTrack(this.list[this.currentTrackIndex])
      }
    }, 
    pause () {
      this.widget.pause()
      this.isPlaying = false
    },
    play () {
      if (this.widget && this.currentTrack) {
        this.widget.play()
        this.isPlaying = true
      }
    },
    previous () {
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
    setTime(e, el) {
      this.widget.getDuration(duration => {
        this.widget.seekTo(parseInt(e.offsetX / el.offsetWidth * duration))
      })
    },
    setVolume (e, el) {
      this.volume = (e.offsetX / el.offsetWidth) * 100
      if (this.isMuted) this.isMuted = false
    },
    // setCurrentDuration(time) {
    //   dispatch('formatTime', payload)
    //     .then(data => {
    //       commit('SET_CURRENT_DURATION', data)
    //     })
    // },
    // setTotalDuration({ time) {
    //   dispatch('formatTime', payload)
    //     .then(data => {
    //       commit('SET_TOTAL_DURATION', data)
    //     })
    // },
    unmute () {
      this.isMuted = true
    },
    _handleMouseUp () {
      this.isDraggable = false
    },
    _handleTimelineClick (e) {
      this.isDraggable = true
      this.setTime(e, this.els.timeline)
    },
    _handleTimelineMove (e) {
      if (this.isDraggable) this.setTime(e, this.els.timeline)
    },
    _handleVolumeClick (e) {
      this.isDraggable = true
      this.setVolume(e, this.els.volume)
    },
    _handleVolumeMove (e) {
      if (this.isDraggable) this.setVolume(e, this.els.volume)
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
      if (this.els.timeline) {
        this.els.timeline.addEventListener('mousedown', this._handleTimelineClick)
        this.els.timeline.addEventListener('mousemove', this._handleTimelineMove)
      }
      if (this.els.volume) {
        this.els.volume.addEventListener('mousedown', this._handleVolumeClick)
        this.els.volume.addEventListener('mousemove', this._handleVolumeMove)
      }
      document.addEventListener('mouseup', this._handleMouseUp)
    })
  },
  beforeDestoy() {
    this.widget.unbind(SC.Widget.Events.READY)
    this.widget.unbind(SC.Widget.Events.PLAY_PROGRESS)
    if (this.els.timeline) {
      this.els.timeline.removeEventListener('mousedown', this._handleTimelineClick)
      this.els.timeline.removeEventListener('mousemove', this._handleTimelineMove)
    }
    if (this.els.volume) {
      this.els.volume.removeEventListener('mousedown', this._handleVolumeClick)
      this.els.volume.removeEventListener('mousemove', this._handleVolumeMove)
    }
    document.removeEventListener('mouseup', this._handleMouseUp)
  }
}