const colorFn = require('colorizr');

// const {
//   parseHEXAColor,
//   getRGBColorStr,
//   getHSLColorStr,
//   getHEXColorStr,
//   convertHEXAlphaValueToNumber,
// } = require('./utils');
const {
  // DEFAULT_HEX_ALPHA,
  // DEFAULT_ALPHA,
  HEX_COLOR,
  RGB_COLOR,
  HSL_COLOR,
  KEYWORD_COLOR,
} = require('./constants');

// const convertHEXColor = (node, options) => {
//   const colorObj = parseHEXAColor(node.value);

//   if (options.outputColorFormat === RGB_COLOR) {
//     node.value = getRGBColorStr(
//       HEX_COLOR,
//       colorObj.hexColor,
//       options.alwaysAlpha || colorObj.hexAlpha !== DEFAULT_HEX_ALPHA ? convertHEXAlphaValueToNumber(colorObj.hexAlpha) : false,
//     )
//   } else if (options.outputColorFormat === HSL_COLOR) {
//     node.value = getHSLColorStr(
//       HEX_COLOR,
//       colorObj.hexColor,
//       options.alwaysAlpha || colorObj.hexAlpha !== DEFAULT_HEX_ALPHA ? convertHEXAlphaValueToNumber(colorObj.hexAlpha) : false,
//     );
//   }

//   return node;
// };

// const convertRGBColor = (node, options) => {
//   const newNode = node.clone({ type: 'word' });
//   const isModernSyntax = !node.nodes.join(' ').includes(',');
//   let r,g,b,a;

//   if (!isModernSyntax) {
//     [r, , g, , b, , a] = node.nodes;
//   } else {
//     [r, g, b, , a] = node.nodes;
//   }

//   if (options.outputColorFormat === HEX_COLOR) {
//     newNode.value = getHEXColorStr(
//       RGB_COLOR,
//       [+r.value, +g.value, +b.value],
//       ((a && +a.value !== DEFAULT_ALPHA && a.value)),
//     );
//   } else if (options.outputColorFormat === HSL_COLOR) {
//     newNode.value = getHSLColorStr(
//       RGB_COLOR,
//       [+r.value, +g.value, +b.value],
//       ((a && a.value) || (options.alwaysAlpha && DEFAULT_ALPHA)),
//       isModernSyntax
//     );
//   } else if (options.outputColorFormat === RGB_COLOR) {
//     newNode.value = getRGBColorStr(
//       RGB_COLOR,
//       [+r.value, +g.value, +b.value],
//       (a && a.value) || (options.alwaysAlpha && DEFAULT_ALPHA),
//       isModernSyntax
//     );
//   }

//   node.replaceWith(newNode);

//   return node;
// };

// const convertHSLColor = (node, options) => {
//   const newNode = node.clone({ type: 'word' });
//   let h,s,l,a;
//   const isModernSyntax = !node.nodes.join(' ').includes(',');

//   if (!isModernSyntax) {
//     [h, , s, , l, , a] = node.nodes;
//   } else {
//     [h, s, l, , a] = node.nodes;
//   }

//   if (options.outputColorFormat === HEX_COLOR) {
//     newNode.value = getHEXColorStr(
//       HSL_COLOR,
//       [+h.value, +s.value, +l.value],
//       ((a && +a.value !== DEFAULT_ALPHA && a.value)),
//     );
//   } else if (options.outputColorFormat === RGB_COLOR) {
//     newNode.value = getRGBColorStr(
//       HSL_COLOR,
//       [+h.value, +s.value, +l.value],
//       ((a && a.value) || (options.alwaysAlpha && DEFAULT_ALPHA)),
//       isModernSyntax
//     );
//   } else if (options.outputColorFormat === HSL_COLOR) {
//     newNode.value = getHSLColorStr(
//       HSL_COLOR,
//       [+h.value, +s.value, +l.value],
//       (a && a.value) || (options.alwaysAlpha && DEFAULT_ALPHA),
//       isModernSyntax
//     );
//   }

//   node.replaceWith(newNode);

//   return node;
// };

// const convertKeywordColor = (node, options) => {
//   const newColor = colorFn.convert(node.value, 'hex');

//   if (options.outputColorFormat === HEX_COLOR) {
//     node.value = newColor;
//   } else if (options.outputColorFormat === RGB_COLOR) {
//     node.value = getRGBColorStr(
//       HEX_COLOR,
//       newColor,
//       options.alwaysAlpha && DEFAULT_ALPHA,
//       options.isUseModernSyntax,
//     );
//   } else if (options.outputColorFormat === HSL_COLOR) {
//     node.value = getHSLColorStr(
//       HEX_COLOR,
//       newColor,
//       options.alwaysAlpha && DEFAULT_ALPHA,
//       options.isUseModernSyntax,
//     );
//   }

//   return node;
// };

const getFormattedString = (
  colorData,
  outputFormat,
  alpha,
  isUseModernSyntax,
) => {
  switch (outputFormat) {
    case HEX_COLOR:
      return alpha !== undefined ? colorFn.addAlphaToHex(colorData, alpha) : colorData;
    case RGB_COLOR:
      return isUseModernSyntax
        ? `${outputFormat}${alpha !== undefined ? 'a' : ''}(${colorData.r} ${colorData.g} ${colorData.b}${alpha !== undefined ? ` / ${alpha}` : ''})`
        : `${outputFormat}${alpha !== undefined ? 'a' : ''}(${colorData.r}, ${colorData.g}, ${colorData.b}${alpha !== undefined ? `, ${alpha}` : ''})`
    case HSL_COLOR:
      return isUseModernSyntax
        ? `${outputFormat}${alpha !== undefined ? 'a' : ''}(${Math.round(colorData.h)} ${Math.round(colorData.s)}% ${Math.round(colorData.l)}%${alpha !== undefined ? ` / ${alpha}` : ''})`
        : `${outputFormat}${alpha !== undefined ? 'a' : ''}(${Math.round(colorData.h)}, ${Math.round(colorData.s)}%, ${Math.round(colorData.l)}%${alpha !== undefined ? `, ${alpha}` : ''})`
    default:
      break;
  }
}

const convertColor = (node, inputColorFormat, options) => {
  const newNode = node.clone({ type: 'word' });
  const isUseModernSyntax = node.params && !/,/.test(node.params);

  let colorData;
  let alpha;

  switch (inputColorFormat) {
    case KEYWORD_COLOR:
      if (options.alwaysAlpha) {
        alpha = 1;
      }

      colorData = colorFn.parseCSS(node.value, options.outputColorFormat);
      break;
    case HEX_COLOR:
      alpha = colorFn.extractAlphaFromHex(node.value.length <= 5 ? colorFn.formatHex(node.value) : node.value);

      if (alpha === undefined && options.alwaysAlpha) {
        alpha = 1;
      } else if (alpha === 1 && !options.alwaysAlpha) {
        alpha = undefined;
      }

      colorData = colorFn.parseCSS(node.value, options.outputColorFormat);
      break;
    case RGB_COLOR:
      let r,g,b;

      if (!isUseModernSyntax) {
        [r, , g, , b, , alpha] = node.nodes;
      } else {
        [r, g, b, , alpha] = node.nodes;
      }

      alpha = alpha && alpha.value !== undefined ? +alpha.value : options.alwaysAlpha ? 1 : undefined;

      if (options.outputColorFormat === RGB_COLOR) {
        colorData = {r: +r.value, g: +g.value, b: +b.value};
      } else {
        colorData = colorFn[`rgb2${options.outputColorFormat}`]([+r.value, +g.value, +b.value])
      }

      break;
    case HSL_COLOR:
      let h,s,l;

      if (!isUseModernSyntax) {
        [h, , s, , l, , alpha] = node.nodes;
      } else {
        [h, s, l, , alpha] = node.nodes;
      }

      alpha = alpha && alpha.value !== undefined ? +alpha.value : options.alwaysAlpha ? 1 : undefined;

      if (options.outputColorFormat === HSL_COLOR) {
        colorData = { h: +h.value, s: +s.value, l: +l.value};
      } else {
        colorData = colorFn[`hsl2${options.outputColorFormat}`]([+h.value, +s.value, +l.value])
      }

      break;
    default:
      break;
  }

  newNode.value = getFormattedString(colorData, options.outputColorFormat, alpha, isUseModernSyntax);

  return node.replaceWith(newNode);
}

module.exports = {
  // convertHEXColor,
  // convertRGBColor,
  // convertHSLColor,
  // convertKeywordColor,
  convertColor,
  getFormattedString,
};
