const convert = require('color-convert');

const {
  DEFAULT_HEX_ALPHA,
  HEX_COLOR,
  RGB_COLOR,
  HSL_COLOR,
  KEYWORD_COLOR,
} = require('./constants');

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
      hexAlpha = DEFAULT_HEX_ALPHA;
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

const getHEXColorStr = (inputColorFormat, color, alpha) => (
  alpha
    ? `#${ convert[inputColorFormat].hex(color) }${ convertNumberAlphaValueToHEX(alpha) }`.toLowerCase()
    : `#${ convert[inputColorFormat].hex(color) }`.toLowerCase()
);

const getRGBColorStr = (inputColorFormat, color, alpha) => {
  if (inputColorFormat === HEX_COLOR) {
    return alpha
      ? `rgba(${ convert[inputColorFormat].rgb(color).join(', ') }, ${ convertHEXAlphaValueToNumber(alpha) })`
      : `rgb(${ convert[inputColorFormat].rgb(color).join(', ') })`;
  }

  if (inputColorFormat === HSL_COLOR || inputColorFormat === KEYWORD_COLOR) {
    return alpha
      ? `rgba(${ convert[inputColorFormat].rgb(color).join(', ') }, ${ alpha })`
      : `rgb(${ convert[inputColorFormat].rgb(color).join(', ') })`;
  }

  return `rgba(${ color.join(', ') }, ${ alpha })`;
};

const getHSLStr = (color, inputColorFormat) => {
  const colorArr = inputColorFormat !== HSL_COLOR
    ? convert[inputColorFormat].hsl(color)
    : color;
  return `${ colorArr[0] }, ${ colorArr[1] }%, ${ colorArr[2] }%`;
};

const getHSLColorStr = (inputColorFormat, color, alpha) => {
  const colorStr = getHSLStr(color, inputColorFormat);

  if (inputColorFormat === HEX_COLOR) {
    return alpha
      ? `hsla(${ colorStr }, ${ convertHEXAlphaValueToNumber(alpha) })`
      : `hsl(${ colorStr })`;
  }

  if (inputColorFormat === RGB_COLOR || inputColorFormat === KEYWORD_COLOR) {
    return alpha
      ? `hsla(${ colorStr }, ${ alpha })`
      : `hsl(${ colorStr })`;
  }

  return `hsla(${ colorStr }, ${ alpha })`;
};

module.exports = {
  parseHEXAColor,
  getRGBColorStr,
  getHSLColorStr,
  getHEXColorStr,
};
