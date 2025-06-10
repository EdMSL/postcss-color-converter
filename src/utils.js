const convert = require('color-convert').default;

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

const convertHEXAlphaValueToNumber = value => Number((parseInt(value, 16) / 255).toFixed(2)).toString();

const convertNumberAlphaValueToHEX = value => {
  let result = Math.round((value * 255)).toString(16);

  if (result == '0') {
    result = '00';
  }

  return result;
};

const getHEXColorStr = (inputColorFormat, color, alpha) => (
  alpha
    ? `#${ convert[inputColorFormat].hex(color) }${ convertNumberAlphaValueToHEX(+alpha) }`.toLowerCase()
    : `#${ convert[inputColorFormat].hex(color) }`.toLowerCase()
);

const getRGBColorArr = (color, inputColorFormat) =>
  inputColorFormat !== RGB_COLOR
    ? convert[inputColorFormat].rgb(color)
    : color;

const getRGBColorStr = (inputColorFormat, color, alpha, isUseModernSyntax) => {
  const colorStr = getRGBColorArr(color, inputColorFormat).join(isUseModernSyntax ? ' ' : ', ');

  if (isUseModernSyntax) {
    return `rgb(${ colorStr }${alpha ? ` / ${alpha}` : ''})`;
  }

  return alpha
    ? `rgba(${ colorStr }, ${ alpha })`
    : `rgb(${ colorStr })`;
};

const getHSLArr = (color, inputColorFormat) => {
  const colorArr = inputColorFormat !== HSL_COLOR
    ? convert[inputColorFormat].hsl(color)
    : color;

  return [colorArr[0].toString(), `${colorArr[1]}%`, `${colorArr[2]}%`];
};

const getHSLColorStr = (inputColorFormat, color, alpha, isUseModernSyntax) => {
  const colorStr = getHSLArr(color, inputColorFormat).join(isUseModernSyntax ? ' ' : ', ');

  if (isUseModernSyntax) {
    return `hsl(${ colorStr }${alpha ? ` / ${alpha}` : ''})`;
  }

  return alpha
    ? `hsla(${ colorStr }, ${ alpha })`
    : `hsl(${ colorStr })`;
};


module.exports = {
  parseHEXAColor,
  getRGBColorStr,
  getHSLColorStr,
  getHEXColorStr,
  convertHEXAlphaValueToNumber,
  convertNumberAlphaValueToHEX,
};
