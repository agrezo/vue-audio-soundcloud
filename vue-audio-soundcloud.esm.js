import Vue from 'vue';

const convertTimeMMSS = val => {
  // TODO: to fix
  let mmss = new Date(val).toISOString().substr(11, 8);
  return mmss.indexOf('00:') === 0 ? mmss.substr(3) : mmss;
};

var script = {
  name: 'vue-audio-soundcloud',
  props: {
    elements: {
      type: Object,
      default: {}
    },
    defaultVolume: {
      type: Number,
      default: 100
    }
  },
  data: () => ({
    currentTrack: {},
    duration: {
      current: '00:00',
      total: '--:--'
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
    seekToShortcutAvailable: true,
    volume: 100,
    widget: {}
  }),
  methods: {
    finished() {
      if (this.isLoop === 'track') {
        this.widget.seekTo(0);
        return this.play();
      }
      this.next();
      if (this.list && this.list.length <= 0 || this.list && this.list.length > 0 && !this.isLoop) this.pause();
    },

    load({ track, list }) {
      this.isLoading = true;
      this.loadList(track, list);
      this.loadTrack(track);
    },

    loadList(track, list) {
      if (!list) return this.list = [], this.listPosition = false;
      this.list = list;
      this.setListPosition(list.findIndex(item => item.id === track.id));
    },

    loadTrack(track) {
      this.currentTrack = track;
      this.progression = 0;
      this.duration.total = convertTimeMMSS(track.duration);
      this.loadWidget(track);
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
          this.isLoading = false;
          this.isPlaying = true;
          this.isMuted ? this.widget.setVolume(0) : this.widget.setVolume(this.volume);
          this.$emit('onLoad', this.currentTrack.id);
        }
      });
    },

    loop() {
      let states = [false, 'track', 'list'];
      if (this.list.length > 0) {
        this.isLoop = this.isLoop === 'list' ? states[0] : states[states.indexOf(this.isLoop) + 1];
        this.setListPosition(); // to update listPosition first and last
      } else this.isLoop = this.isLoop === 'track' ? states[0] : states[states.indexOf(this.isLoop) + 1];
    },

    mute() {
      this.isMuted = true;
      this.widget.setVolume(0);
    },

    next() {
      if (this.list && this.list.length > 0) {
        if (this.isLoop === 'list' && this.listPosition.current === this.list.length - 1) {
          this.setListPosition(0);
          this.loadTrack(this.list[this.listPosition.current]);
        } else if (this.listPosition.current >= 0 && this.listPosition.current < this.list.length - 1) {
          this.setListPosition(this.listPosition.current + 1);
          this.loadTrack(this.list[this.listPosition.current]);
        }
      }
    },

    pause() {
      this.widget.pause();
      this.isPlaying = false;
      this.$emit('onPause');
    },

    play() {
      if (this.widget && Object.keys(this.currentTrack).length > 0) {
        this.widget.play();
        this.isPlaying = true;
        this.$emit('onPlay');
      }
    },

    previous() {
      if (this.list && this.list.length > 0) {
        this.widget.getPosition(data => {
          const position = data / 1000;
          if (position > 10) return this.widget.seekTo(0);
          if (this.isLoop === 'list' && this.listPosition.current === 0) {
            this.setListPosition(this.list.length - 1);
            this.loadTrack(this.list[this.listPosition.current]);
          } else if (this.listPosition.current > 0) {
            this.setListPosition(this.listPosition.current - 1);
            this.loadTrack(this.list[this.listPosition.current]);
          }
        });
      }
    },

    setListPosition(position) {
      if (!this.listPosition) this.listPosition = {};
      this.listPosition.current = position !== undefined ? position : this.listPosition.current;
      this.listPosition.first = this.listPosition.current <= 0 && this.isLoop !== 'list' ? true : false;
      this.listPosition.last = this.listPosition.current === this.list.length - 1 && this.isLoop !== 'list' ? true : false;
    },

    setTime(e, el) {
      this.widget.getDuration(duration => {
        this.widget.seekTo(parseInt(e.offsetX / el.offsetWidth * duration));
      });
    },

    setVolume(e, el) {
      this.volume = parseInt(e.offsetX / el.offsetWidth * 100);
      this.widget.setVolume(this.volume);
      if (this.isMuted) this.isMuted = false;
    },

    unmute() {
      this.isMuted = false;
      this.widget.setVolume(this.volume);
    },

    _handleMouseUp() {
      this.isDraggable = false;
    },

    _handleTimelineClick(e) {
      this.isDraggable = true;
      this.setTime(e, this.els.timeline);
    },

    _handleTimelineMove(e) {
      if (this.isDraggable) this.setTime(e, this.els.timeline);
    },

    _handleVolumeClick(e) {
      this.isDraggable = true;
      this.setVolume(e, this.els.volume);
    },

    _handleVolumeMove(e) {
      if (this.isDraggable) this.setVolume(e, this.els.volume);
    },

    _shortcuts(e) {
      let key = e.which || e.keyCode;
      if (key === 32) {
        // Space bar
        e.preventDefault();
        this.isPlaying ? this.pause() : this.play();
      } else if (key === 77) this.isMuted ? this.unmute() : this.mute(); // M
      else if (key === 37 && e.shiftKey) {
          // SHIFT + L-ARROW
          this.previous();
        } else if (key === 39 && e.shiftKey) {
          // SHIFT + R-ARROW
          this.next();
        } else if (key === 37 || key === 39) {
          // L-ARROW
          this.widget.getPosition(position => {
            if (this.seekToShortcutAvailable) {
              if (key === 37) position >= 5000 ? this.widget.seekTo(position - 5000) : this.widget.seekTo(0);
              if (key === 39) this.widget.seekTo(position + 5000);
              this.seekToShortcutAvailable = false;
              setTimeout(() => {
                this.seekToShortcutAvailable = true;
              }, 200);
            }
          });
        } else if (key === 38 && e.shiftKey) {
          // SHIFT + U-ARROW
          this.volume <= 95 ? this.volume += 5 : this.volume = 100;
          this.widget.setVolume(this.volume);
        } else if (key === 40 && e.shiftKey) {
          // SHIFT + D-ARROW
          this.volume >= 5 ? this.volume -= 5 : this.volume = 0;
          this.widget.setVolume(this.volume);
        }
    }
  },
  mounted() {
    Vue.prototype.$AudioSoundcloud = {
      load: params => this.load(params)
    };

    this.volume = this.defaultVolume;

    this.widget = SC.Widget('soundcloud-iframe');
    this.els.timeline = document.getElementById(this.elements.timeline);
    this.els.volume = document.getElementById(this.elements.volume);

    this.widget.bind(SC.Widget.Events.READY, () => {
      this.widget.bind(SC.Widget.Events.FINISH, () => {
        this.finished();
      });
      this.widget.bind(SC.Widget.Events.PAUSE, () => {
        this.isPlaying = false;
        this.$emit('onPause');
      });
      this.widget.bind(SC.Widget.Events.PLAY, () => {
        this.isPlaying = true;
        this.$emit('onPlay');
      });
      this.widget.bind(SC.Widget.Events.PLAY_PROGRESS, data => {
        this.progression = data.relativePosition * 100;
        this.duration.current = convertTimeMMSS(data.currentPosition);
      });
      if (this.els.timeline) {
        this.els.timeline.addEventListener('mousedown', this._handleTimelineClick);
        this.els.timeline.addEventListener('mousemove', this._handleTimelineMove);
      }
      if (this.els.volume) {
        this.els.volume.addEventListener('mousedown', this._handleVolumeClick);
        this.els.volume.addEventListener('mousemove', this._handleVolumeMove);
      }
      document.addEventListener('mouseup', this._handleMouseUp);
      document.addEventListener('keydown', this._shortcuts);
    });
  },
  beforeDestoy() {
    this.widget.unbind(SC.Widget.Events.FINISH);
    this.widget.unbind(SC.Widget.Events.PAUSE);
    this.widget.unbind(SC.Widget.Events.PLAY);
    this.widget.unbind(SC.Widget.Events.PLAY_PROGRESS);
    this.widget.unbind(SC.Widget.Events.READY);
    if (this.els.timeline) {
      this.els.timeline.removeEventListener('mousedown', this._handleTimelineClick);
      this.els.timeline.removeEventListener('mousemove', this._handleTimelineMove);
    }
    if (this.els.volume) {
      this.els.volume.removeEventListener('mousedown', this._handleVolumeClick);
      this.els.volume.removeEventListener('mousemove', this._handleVolumeMove);
    }
    document.removeEventListener('mouseup', this._handleMouseUp);
    document.removeEventListener('keydown', this._shortcuts);
  }
};

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "vue-audio-soundcloud" }, [_c("iframe", {
    attrs: {
      id: "soundcloud-iframe",
      width: "100%",
      height: "166",
      scrolling: "no",
      frameborder: "no",
      allow: "autoplay",
      src: "https://w.soundcloud.com/player/?url="
    }
  }), _vm._v(" "), _c("div", { staticClass: "vue-audio-soundcloud-container" }, [_vm._t("default", null, null, {
    currentTrack: _vm.currentTrack,
    duration: _vm.duration,
    listPosition: _vm.listPosition,
    loop: _vm.loop,
    isLoading: _vm.isLoading,
    isLoop: _vm.isLoop,
    isMuted: _vm.isMuted,
    isPlaying: _vm.isPlaying,
    next: _vm.next,
    play: _vm.play,
    pause: _vm.pause,
    previous: _vm.previous,
    progression: _vm.progression,
    volume: _vm.volume
  })], 2)]);
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

/* style */
const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-15c1376a_0", { source: "\n#soundcloud-iframe[data-v-15c1376a] {\n  left: 99999px;\n  position: fixed;\n  top: 0;\n}\n", map: { "version": 3, "sources": ["/Users/flavio/Desktop/Projects/vue-audio-soundcloud/src/Player.vue"], "names": [], "mappings": ";AA2BA;EACA,cAAA;EACA,gBAAA;EACA,OAAA;CACA", "file": "Player.vue", "sourcesContent": ["<template>\n  <div class=\"vue-audio-soundcloud\">\n    <iframe id=\"soundcloud-iframe\" width=\"100%\" height=\"166\" scrolling=\"no\" frameborder=\"no\" allow=\"autoplay\" src=\"https://w.soundcloud.com/player/?url=\"></iframe>\n    <div class=\"vue-audio-soundcloud-container\">\n      <slot v-bind=\"{ \n        currentTrack,\n        duration,\n        listPosition,\n        loop,\n        isLoading,\n        isLoop,\n        isMuted,\n        isPlaying,\n        next,\n        play,\n        pause,\n        previous,\n        progression,\n        volume,\n      }\"></slot>\n    </div>\n  </div>\n</template>\n\n<script src=\"./plugin.js\"></script>\n\n<style scoped>\n  #soundcloud-iframe {\n    left: 99999px;\n    position: fixed;\n    top: 0;\n  }\n</style>"] }, media: undefined });
};
/* scoped */
const __vue_scope_id__ = "data-v-15c1376a";
/* module identifier */
const __vue_module_identifier__ = undefined;
/* functional template */
const __vue_is_functional_template__ = false;
/* component normalizer */
function __vue_normalize__(template, style, script$$1, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  const component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

  {
    component.__file = "/Users/flavio/Desktop/Projects/vue-audio-soundcloud/src/Player.vue";
  }

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;

    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    let hook;
    if (style) {
      hook = function (context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        const originalRender = component.render;
        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        const existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */
function __vue_create_injector__() {
  const head = document.head || document.getElementsByTagName('head')[0];
  const styles = __vue_create_injector__.styles || (__vue_create_injector__.styles = {});
  const isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

    if (!style.ids.includes(id)) {
      let code = css.source;
      let index = style.ids.length;

      style.ids.push(id);

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        const el = style.element = document.createElement('style');
        el.type = 'text/css';

        if (css.media) el.setAttribute('media', css.media);
        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        const textNode = document.createTextNode(code);
        const nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */

var Player = __vue_normalize__({ render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ }, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, __vue_create_injector__, undefined);

const VueAudioSoundcloud = {};

VueAudioSoundcloud.install = function (Vue$$1) {
  Vue$$1.component('vue-audio-soundcloud', Player);
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueAudioSoundcloud);
}

export default VueAudioSoundcloud;
