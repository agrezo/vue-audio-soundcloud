import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import vue from 'rollup-plugin-vue'
import replace from 'rollup-plugin-replace'

const config = require('../package.json')

export default {
  input: 'src/index.js',
  name: 'vue-audio-soundcloud',
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    vue({
      entry: 'index.js',
      compileTemplate: true
    }),
    babel({
      exclude: 'node_modules/**',
      'plugins': [
        'external-helpers',
      ],
    }),
    replace({
      VERSION: JSON.stringify(config.version),
    })
  ],
  watch: {
    include: 'src/**',
  }
}