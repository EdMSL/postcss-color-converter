const convert = require('color-convert');

const parseHEXAColor = color => {
  const newColor = color.slice(1);
  let hexColor;
  let hexAlpha;

  switch (newColor.length) {
    case 4:
      hexAlpha = newColor.slice(-1) + newColor.slice(-1);
      hexColor = newColor.slice(0, -1);
      break;
    case 8:
      hexAlpha = newColor.slice(-2);
      hexColor = newColor.slice(0, -2);
      break;
    case 3:
    case 6:
      hexAlpha = 'ff';
      hexColor = newColor;
      break;
  }

  return {
    hexColor,
    hexAlpha,
  };
};

const convertHEXAlphaValueToNumber = value => Number((parseInt(value, 16) / 255).toFixed(2));

const convertNumberAlphaValueToHEX = value => Math.round((value * 255)).toString(16);

const getHEXColorStr = (color, inputColorFormat) => `#${ convert[inputColorFormat].hex(color) }`.toLowerCase();

const getHEXAColorStr = (color, alpha, inputColorFormat) => `#${ convert[inputColorFormat].hex(color) }${ convertNumberAlphaValueToHEX(alpha) }`.toLowerCase();

const getRGBColorStr = (color, inputColorFormat) => `rgb(${ convert[inputColorFormat].rgb(color).join(', ') })`;

const getRGBAColorStr = (color, alpha, inputColorFormat) => {
  if (inputColorFormat === 'hex') {
    return `rgba(${ convert[inputColorFormat].rgb(color).join(', ') }, ${ convertHEXAlphaValueToNumber(alpha) })`;
  }

  if (inputColorFormat === 'hsl') {
    return `rgba(${ convert[inputColorFormat].rgb(color).join(', ') }, ${ alpha })`;
  }

  return '';
};

const getHSLStr = (color, inputColorFormat) => {
  const colorArr = convert[inputColorFormat].hsl(color);
  return `${ colorArr[0] }, ${ colorArr[1] }%, ${ colorArr[2] }%`;
};

const getHSLColorStr = (color, inputColorFormat) => `hsl(${ getHSLStr(color, inputColorFormat) })`;

const getHSLAColorStr = (color, alpha, inputColorFormat) => {
  if (inputColorFormat === 'hex') {
    const colorStr = getHSLStr(color, inputColorFormat);

    return `hsla(${ colorStr }, ${ convertHEXAlphaValueToNumber(alpha) })`;
  }

  return '';
};

module.exports = {
  parseHEXAColor,
  getRGBColorStr,
  getRGBAColorStr,
  getHSLColorStr,
  getHSLAColorStr,
  getHEXColorStr,
  getHEXAColorStr,
};
