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

const getHEXColorStr = (inputColorFormat, color, alpha) => (
  alpha
    ? `#${ convert[inputColorFormat].hex(color) }${ convertNumberAlphaValueToHEX(alpha) }`.toLowerCase()
    : `#${ convert[inputColorFormat].hex(color) }`.toLowerCase()
);

const getRGBColorStr = (inputColorFormat, color, alpha) => {
  if (inputColorFormat === 'hex') {
    return alpha
      ? `rgba(${ convert[inputColorFormat].rgb(color).join(', ') }, ${ convertHEXAlphaValueToNumber(alpha) })`
      : `rgb(${ convert[inputColorFormat].rgb(color).join(', ') })`;
  }

  if (inputColorFormat === 'hsl') {
    return alpha
      ? `rgba(${ convert[inputColorFormat].rgb(color).join(', ') }, ${ alpha })`
      : `rgb(${ convert[inputColorFormat].rgb(color).join(', ') })`;
  }

  return '';
};

const getHSLStr = (color, inputColorFormat) => {
  const colorArr = convert[inputColorFormat].hsl(color);
  return `${ colorArr[0] }, ${ colorArr[1] }%, ${ colorArr[2] }%`;
};

// const getHSLColorStr = (color, inputColorFormat) => `hsl(${ getHSLStr(color, inputColorFormat) })`;

const getHSLColorStr = (inputColorFormat, color, alpha) => {
  const colorStr = getHSLStr(color, inputColorFormat);

  if (inputColorFormat === 'hex') {
    return alpha
      ? `hsla(${ colorStr }, ${ convertHEXAlphaValueToNumber(alpha) })`
      : `hsl(${ colorStr })`;
  }

  if (inputColorFormat === 'rgb') {
    return alpha
      ? `hsla(${ colorStr }, ${ alpha })`
      : `hsl(${ colorStr })`;
  }

  return '';
};

module.exports = {
  parseHEXAColor,
  getRGBColorStr,
  getHSLColorStr,
  getHEXColorStr,
};
