import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    file: 'dist/vue-audio-soundcloud.umd.js',
    format: 'umd',
    exports: 'named'
  },
})

export default config