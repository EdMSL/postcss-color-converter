import convert from 'color-convert';

import {
  DEFAULT_HEX_ALPHA,
  RGB_COLOR,
  HSL_COLOR,
} from './constants.js';

export function parseHEXAColor(color) {
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
}

export function convertHEXAlphaValueToNumber(value) {return Number((Number.parseInt(value, 16) / 255).toFixed(2)).toString();}

export function convertNumberAlphaValueToHEX(value) {
  let result = Math.round((value * 255)).toString(16);

  if (result === '0') {
    result = '00';
  }

  return result;
}

export function getHEXColorStr(inputColorFormat, color, alpha) {
  const newColor = '#' + convert[inputColorFormat].hex(color);

  return alpha
    ? (newColor + convertNumberAlphaValueToHEX(+alpha)).toLowerCase()
    : newColor.toLowerCase();
}

export function getRGBColorArr(color, inputColorFormat) {
  return inputColorFormat === RGB_COLOR
    ? color
    : convert[inputColorFormat].rgb(color);
}

export function getRGBColorStr(inputColorFormat, color, alpha, isUseModernSyntax) {
  const join = isUseModernSyntax
? ' '
: ', ';
  const colorString = getRGBColorArr(color, inputColorFormat).join(join);

  if (alpha) {
    return isUseModernSyntax
      ? `rgb(${ colorString } / ${ alpha })`
      : `rgba(${ colorString }, ${ alpha })`;
  }

  return `rgb(${ colorString })`;
}

export function getHSLArr(color, inputColorFormat) {
  const colorArray = inputColorFormat === HSL_COLOR
    ? color
    : convert[inputColorFormat].hsl(color);

  return [colorArray[0].toString(), `${colorArray[1]}%`, `${colorArray[2]}%`];
}

export function getHSLColorStr(inputColorFormat, color, alpha, isUseModernSyntax) {
  const join = isUseModernSyntax
? ' '
: ', ';
  const colorString = getHSLArr(color, inputColorFormat).join(join);

  if (alpha) {
    return isUseModernSyntax
      ? `hsl(${ colorString } / ${ alpha })`
      : `hsla(${ colorString }, ${ alpha })`;
  }

  return `hsl(${ colorString })`;
}
