const plugin = require('../../index');

module.exports = {
  syntax: 'postcss-scss',
  plugins: [
    plugin({
      outputColorFormat: 'rgb',
      alwaysAlpha: false,
      ignore: [],
    }),
  ],
};
