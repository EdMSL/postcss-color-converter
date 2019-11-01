const convert = require('color-convert');

function getRGBColorStr (color, outputColorFormat) {
  if (outputColorFormat === 'rgb') {
    return `rgb(${ convert.hex.rgb(color).join(', ') })`
  }

  if (outputColorFormat === 'hsl') {
    const colorArr = convert.hex.hsl(color);
    const colorStr = `${ colorArr[0] }, ${ colorArr[1] }%, ${ colorArr[2] }%`;

    return `hsl(${ colorStr })`;
  }

  return color;
};

function getHSLColorStr (color, outputColorFormat) {
  if (outputColorFormat === 'rgb') {
    return `rgb(${ convert.hex.rgb(color).join(', ') })`
  }

  if (outputColorFormat === 'hsl') {
    const colorArr = convert.hex.hsl(color);
    const colorStr = `${ colorArr[0] }, ${ colorArr[1] }%, ${ colorArr[2] }%`;

    return `hsl(${ colorStr })`;
  }

  return color;
};

module.exports = {
  getRGBColorStr,
  getHSLColorStr,
};
