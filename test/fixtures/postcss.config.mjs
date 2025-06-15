/* global process */

import plugin from '../../index.js';

export default  {
  syntax: 'postcss-scss',
  plugins: [
    plugin({
      outputColorFormat: 'rgb',
      alwaysAlpha: false,
      ignore: [],
    }),
  ],
}
