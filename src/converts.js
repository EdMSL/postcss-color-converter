const colorFn = require('colorizr');

const {
  HEX_COLOR,
  RGB_COLOR,
  HSL_COLOR,
  OKLCH_COLOR,
  KEYWORD_COLOR,
} = require('./constants');

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
      if (options.outputColorFormat === HEX_COLOR) {
        colorData = node.value;
      } else {
        colorData = colorFn.parseCSS(node.value, options.outputColorFormat);

        alpha = colorFn.extractAlphaFromHex(colorFn.formatHex(node.value));

        if (alpha === undefined && options.alwaysAlpha) {
          alpha = 1;
        } else if (alpha === 1 && !options.alwaysAlpha) {
          alpha = undefined;
        }
      }

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

  const newNode = node.clone({ type: 'word' });

  newNode.value = getFormattedString(colorData, options.outputColorFormat, alpha, isUseModernSyntax);

  return node.replaceWith(newNode);
}

module.exports = {
  convertColor,
};
