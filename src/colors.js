const colors = require('color-name');

const colorNames = Object.keys(colors);

const colorFormats = ['hex', 'rgb', 'hsl', 'keyword'];

module.exports = {
  colorFormats,
  colorNames,
};
