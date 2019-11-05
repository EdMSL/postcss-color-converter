const convert = require('color-convert');

const getRGBColorStr = (color, inputColorFormat) => `rgb(${ convert[inputColorFormat].rgb(color).join(', ') })`;

function getHSLColorStr (color, inputColorFormat) {
  const colorArr = convert[inputColorFormat].hsl(color);
  const colorStr = `${ colorArr[0] }, ${ colorArr[1] }%, ${ colorArr[2] }%`;

  return `hsl(${ colorStr })`;
};

module.exports = {
  getRGBColorStr,
  getHSLColorStr,
};
