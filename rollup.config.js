import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.iife.js',
  output: {
    format: 'iife',
    name: 'LchColorWheel',
    file: 'index.iife.js',
  },
  plugins: [resolve(), commonjs(), terser({ warnings: true, output: { semicolons: false }, compress: { passes: 2 } })],
}
