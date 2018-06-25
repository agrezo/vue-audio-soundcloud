import Vue from 'vue'

export const convertTimeMMSS = (val) => { // TODO: to fix
  let mmss = new Date(val).toISOString().substr(11, 8)
  return (mmss.indexOf('00:') === 0) ? mmss.substr(3) : mmss
}

export default {
  name: 'vue-audio-soundcloud',
  props: ['elements'],
  data: () => ({
    currentTrack: {},
    duration: {
      current: '00:00',
      total: '--:--',
    },
    els: {},
    list: [],
    listPosition: {},
    isDraggable: false,
    isLoading: false,
    isLoop: false,
    isMuted: false,
    isPlaying: false,
    progression: 0,
    volume: 80,
    widget: {},
  }),
  methods: {
    finished () {
      if (this.isLoop === 'track') {
        this.widget.seekTo(0)
        return this.play()
      }
      this.next()
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
          this.$emit('change', this.currentTrack.id)
        }
      })
    },

    loop () {
      let states = [false, 'track', 'list']
      this.isLoop = this.isLoop === 'list' ? states[0] : states[states.indexOf(this.isLoop) + 1]
      this.setListPosition() // to update listPosition first and last
    },

    mute () {
      this.isMuted = false
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
    },

    play () {
      if (this.widget && Object.keys(this.currentTrack).length > 0) {
        this.widget.play()
        this.isPlaying = true
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

    setListPosition (position) {
      if (!this.listPosition) this.listPosition = {}
      this.listPosition.current = position !== undefined ? position : this.listPosition.current
      this.listPosition.first = (this.listPosition.current <= 0 && this.isLoop !== 'list' ) ? true : false
      this.listPosition.last = (this.listPosition.current === this.list.length - 1 && this.isLoop !== 'list') ? true : false
    },

    setTime(e, el) {
      this.widget.getDuration(duration => {
        this.widget.seekTo(parseInt(e.offsetX / el.offsetWidth * duration))
      })
    },

    setVolume (e, el) {
      this.volume = (e.offsetX / el.offsetWidth) * 100
      this.widget.setVolume(this.volume)
      if (this.isMuted) this.isMuted = false
    },

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
    Vue.prototype.$audioSoundcloud = {
      load: params => this.load(params)
    }

    this.widget = SC.Widget('soundcloud-iframe');
    this.els.timeline = document.getElementById(this.elements.timeline)
    this.els.volume = document.getElementById(this.elements.volume)

    this.widget.bind(SC.Widget.Events.READY, () => {
      this.widget.bind(SC.Widget.Events.PLAY_PROGRESS, (data) => {
        this.progression = data.relativePosition * 100
        this.duration.current = convertTimeMMSS(data.currentPosition)
      })
      this.widget.bind(SC.Widget.Events.FINISH, () => {
        this.finished()
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
    this.widget.unbind(SC.Widget.Events.FINISH)
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