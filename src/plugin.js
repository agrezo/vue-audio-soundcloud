import Vue from 'vue'

export const convertTimeMMSS = (val) => { // TODO: to fix
  let mmss = new Date(val).toISOString().substr(11, 8)
  return (mmss.indexOf('00:') === 0) ? mmss.substr(3) : mmss
}

export default {
  name: 'vue-audio-soundcloud',
  props: {
    elements: {
      type: Object,
      default: {},
    },
    defaultVolume: {
      type: Number,
      default: 100,
    },
  },
  data: () => ({
    currentTrack: {},
    duration: {
      current: '00:00',
      total: '--:--',
    },
    els: {},
    list: [],
    listPosition: {},
    isDraggable: {
      timeline: false,
      volume: false,
    },
    isLoading: false,
    isLoop: false,
    isMuted: false,
    isPlaying: false,
    progression: 0,
    seekToShortcutAvailable: true,
    volume: 100,
    widget: {},
  }),
  methods: {
    finished () {
      if (this.isLoop === 'track') {
        this.widget.seekTo(0)
        return this.play()
      }
      this.next()
      if (this.list && this.list.length <= 0 || this.list && this.list.length > 0 && !this.isLoop) this.pause()
    },

    load ({track, list}) {
      this.isLoading = true
      this.loadList(track, list)
      this.loadTrack(track)
    },

    loadList (track, list) {
      if (!list) return this.list = [], this.listPosition = false
      this.list = list
      this.setListPosition(list.findIndex(item => item.id === track.id))
    },

    loadTrack (track) {
      this.currentTrack = track
      this.progression = 0
      this.duration.total = convertTimeMMSS(track.duration)
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
          this.$emit('load', this.currentTrack.id)
        }
      })
    },

    loop () {
      let states = [false, 'track', 'list']
      if (this.list.length > 0) {
        this.isLoop = this.isLoop === 'list' ? states[0] : states[states.indexOf(this.isLoop) + 1]
        this.setListPosition() // to update listPosition first and last
      }
      else this.isLoop = this.isLoop === 'track' ? states[0] : states[states.indexOf(this.isLoop) + 1]
    },

    mute () {
      this.isMuted = true
      this.widget.setVolume(0)
    },

    next () {
      if (this.list && this.list.length > 0) {
        if (this.isLoop === 'list' && this.listPosition.current === this.list.length - 1) {
          this.setListPosition(0)
          this.loadTrack(this.list[this.listPosition.current])
        }
        else if (this.listPosition.current >= 0 && this.listPosition.current < this.list.length - 1) {
          this.setListPosition(this.listPosition.current + 1)
          this.loadTrack(this.list[this.listPosition.current])
        }
      }
    }, 

    pause () {
      this.widget.pause()
      this.isPlaying = false
      this.$emit('pause')
    },

    play () {
      if (this.widget && Object.keys(this.currentTrack).length > 0) {
        this.widget.play()
        this.isPlaying = true
        this.$emit('play')
      }
    },

    previous () {
      if (this.list && this.list.length > 0) {
        this.widget.getPosition((data) => {
          const position = data / 1000
          if (position > 10) return this.widget.seekTo(0)
          if (this.isLoop === 'list' && this.listPosition.current === 0) {
            this.setListPosition(this.list.length - 1)
            this.loadTrack(this.list[this.listPosition.current])
          } 
          else if (this.listPosition.current > 0) {
            this.setListPosition(this.listPosition.current - 1)
            this.loadTrack(this.list[this.listPosition.current])
          }
        })
      }
    },

    fastBackward () {
      this.widget.getPosition(position => {
        if (this.seekToShortcutAvailable) {
          position >= 5000 ? this.widget.seekTo(position - 5000) : this.widget.seekTo(0)
          this.seekToShortcutAvailable = false
          setTimeout(() => {
            this.seekToShortcutAvailable = true
          }, 200);
        }
      })
    },

    fastForward () {
      this.widget.getPosition(position => {
        if (this.seekToShortcutAvailable) {
          this.widget.seekTo(position + 5000)
          this.seekToShortcutAvailable = false
          setTimeout(() => {
            this.seekToShortcutAvailable = true
          }, 200);
        }
      })
    },

    setListPosition (position) {
      if (!this.listPosition) this.listPosition = {}
      this.listPosition.current = position !== undefined ? position : this.listPosition.current
      this.listPosition.first = (this.listPosition.current <= 0 && this.isLoop !== 'list' ) ? true : false
      this.listPosition.last = (this.listPosition.current === this.list.length - 1 && this.isLoop !== 'list') ? true : false
    },

    setTime () {
      this.widget.getDuration(duration => {
        this.widget.seekTo(parseInt(this.progression / 100 * duration))
      })
    },

    setVolume (e) {
      this.volume = parseInt((e.offsetX / this.els.volume.offsetWidth) * 100)
      this.widget.setVolume(this.volume)
      if (this.isMuted) this.isMuted = false
      if (this.volume === 0) this.isMuted = true
    },

    unmute () {
      if (this.volume === 0) this.volume = 10
      this.isMuted = false
      this.widget.setVolume(this.volume)
    },

    _disableSelect (e) {
      e.preventDefault()
    },

    _handleMouseUp () {
      if (this.isDraggable.timeline) {
        this.setTime()
        this.els.timeline.removeEventListener('mousedown', this._timelineMove, true)
        window.removeEventListener('mousemove', this._timelineMove, true)
        window.removeEventListener('selectstart', this._disableSelect)
      }

      this.isDraggable = {
        timeline: false,
        volume: false,
      }
    },

    // _handleTimelineClick (e) {
    //   this.isDraggable = true
    //   this.setTime(e, this.els.timeline)
    // },

    // _handleTimelineMove (e) {
    //   if (this.isDraggable) this.setTime(e, this.els.timeline)
    // },
    
   

    // _handleVolumeClick (e) {
    //   this.isDraggable = true
    //   this.setVolume(e)
    // },
    
    // _handleVolumeMove (e) {
    //   if (this.isDraggable) this.setVolume(e)
    // },

    _handleTimelineMouseDown(e) {
      this.isDraggable.timeline = true
      this._timelineMove(e)
      window.addEventListener('mousemove', this._timelineMove, true)
      window.addEventListener('selectstart', this._disableSelect)
    },

    _timelineMove (e) {
      let newProgression = parseInt(((e.clientX - this.els.timeline.getBoundingClientRect().left) / this.els.timeline.offsetWidth) * 100)
      if (newProgression >= 0 && newProgression <= 100) this.progression = newProgression
      if (newProgression < 0) this.progression = 0
      if (newProgression > 100) this.progression = 100
      console.log('progression', this.progression)
    },

    _shortcuts (e) {
      let key = e.which || e.keyCode
      if (key === 32) { // Space bar
        e.preventDefault() 
        this.isPlaying ? this.pause() : this.play()
      }
      else if (key === 77) this.isMuted ? this.unmute() : this.mute() // M
      else if (key === 37 && e.shiftKey) {  // SHIFT + L-ARROW
        this.previous()
      }
      else if (key === 39 && e.shiftKey) { // SHIFT + R-ARROW
        this.next()
      }
      else if (key === 37) {  // L-ARROW
        this.fastBackward()
      }
      else if (key === 39) {  // R-ARROW
        this.fastForward()
      }
      else if (key === 38 && e.shiftKey) { // SHIFT + U-ARROW
        (this.volume <= 95) ? this.volume += 5 : this.volume = 100
        this.widget.setVolume(this.volume)
      }
      else if (key === 40 && e.shiftKey) { // SHIFT + D-ARROW
        (this.volume >= 5) ? this.volume -= 5 : this.volume = 0
        this.widget.setVolume(this.volume)
      }
    }
  },
  created () {
    Vue.prototype.$AudioSoundcloud = {
      load: params => this.load(params),
      pause: () => this.pause(),
      play: () => this.play(),
    }
  },
  mounted () {
    this.volume = this.defaultVolume

    this.widget = SC.Widget('soundcloud-iframe')
    this.els.timeline = document.getElementById(this.elements.timeline)
    this.els.volume = document.getElementById(this.elements.volume)

    this.widget.bind(SC.Widget.Events.READY, () => {
      this.widget.bind(SC.Widget.Events.FINISH, () => {
        this.finished()
      })
      this.widget.bind(SC.Widget.Events.PAUSE, () => {
        this.isPlaying = false
        this.$emit('pause')
      })
      this.widget.bind(SC.Widget.Events.PLAY, () => {
        this.isPlaying = true
        this.$emit('play')
      })
      this.widget.bind(SC.Widget.Events.PLAY_PROGRESS, data => {
        if (!this.isDraggable.timeline) this.progression = data.relativePosition * 100
        this.duration.current = convertTimeMMSS(data.currentPosition)
      })
      if (this.els.timeline) {
        this.els.timeline.addEventListener('mousedown', this._handleTimelineMouseDown, true)
      }
      // if (this.els.timeline) {
      //   this.els.timeline.addEventListener('mousedown', this._handleTimelineMouseDown)
      //   this.els.timeline.addEventListener('mousemove', this._handleTimelineMove)
      // }
      // if (this.els.volume) {
      //   this.els.volume.addEventListener('mousedown', this._handleVolumeClick)
      //   this.els.volume.addEventListener('mousemove', this._handleVolumeMove)
      // }
      window.addEventListener('mouseup', this._handleMouseUp, true)
      window.addEventListener('keydown', this._shortcuts, true)
    })
  },
  beforeDestoy() {
    this.widget.unbind(SC.Widget.Events.FINISH)
    this.widget.unbind(SC.Widget.Events.PAUSE)
    this.widget.unbind(SC.Widget.Events.PLAY)
    this.widget.unbind(SC.Widget.Events.PLAY_PROGRESS)
    this.widget.unbind(SC.Widget.Events.READY)
    if (this.els.timeline) {
      this.els.timeline.removeEventListener('mousedown', this._handleTimelineClick)
      this.els.timeline.removeEventListener('mousemove', this._handleTimelineMove)
    }
    if (this.els.volume) {
      this.els.volume.removeEventListener('mousedown', this._handleVolumeClick)
      this.els.volume.removeEventListener('mousemove', this._handleVolumeMove)
    }
    window.removeEventListener('mouseup', this._handleMouseUp)
    window.removeEventListener('keydown', this._shortcuts)
  }
}