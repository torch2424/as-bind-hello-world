import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

let plugins = [
  resolve(),
  commonjs(),
];

const bundles = [
  {
    input: "browser.js",
    output: {
      file: 'browser.iife.js',
      format: "iife"
    },
    watch: {
      clearScreen: false
    },
    plugins: plugins
  }
];

export default bundles;
