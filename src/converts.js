const colorFn = require('colorizr');

const {
  HEX_COLOR,
  RGB_COLOR,
  HSL_COLOR,
  OKLAB_COLOR,
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
    case OKLAB_COLOR:
      return `${outputFormat}(${colorData.l} ${colorData.a} ${colorData.b}${alpha !== undefined ? ` / ${alpha}` : ''})`;
    case OKLCH_COLOR:
      return `${outputFormat}(${colorData.l} ${colorData.c} ${colorData.h}${alpha !== undefined ? ` / ${alpha}` : ''})`;
    default:
      break;
  }
}

const convertColor = (node, inputColorFormat, options) => {
  const isUseModernSyntax = node.params && !/,/.test(node.params);

  let colorData;
  let c1, c2, c3, alpha;

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
      if (!isUseModernSyntax) {
        [c1, , c2, , c3, , alpha] = node.nodes;
      } else {
        [c1, c2, c3, , alpha] = node.nodes;
      }

      alpha = alpha && alpha.value !== undefined ? +alpha.value : options.alwaysAlpha ? 1 : undefined;

      if (options.outputColorFormat === RGB_COLOR) {
        colorData = {r: +c1.value, g: +c2.value, b: +c3.value};
      } else {
        colorData = colorFn[`rgb2${options.outputColorFormat}`]([+c1.value, +c2.value, +c3.value])
      }

      break;
    case HSL_COLOR:
      if (!isUseModernSyntax) {
        [c1, , c2, , c3, , alpha] = node.nodes;
      } else {
        [c1, c2, c3, , alpha] = node.nodes;
      }

      alpha = alpha && alpha.value !== undefined ? +alpha.value : options.alwaysAlpha ? 1 : undefined;

      if (options.outputColorFormat === HSL_COLOR) {
        colorData = { h: +c1.value, s: +c2.value, l: +c3.value};
      } else {
        colorData = colorFn[`hsl2${options.outputColorFormat}`]([+c1.value, +c2.value, +c3.value])
      }

      break;
    case OKLAB_COLOR:
      [c1, c2, c3, , alpha] = node.nodes;

      alpha = alpha && alpha.value !== undefined ? +alpha.value : options.alwaysAlpha ? 1 : undefined;

      if (options.outputColorFormat === OKLAB_COLOR) {
        colorData = { l: +c1.value > 1 ? +c1.value / 100 : +c1.value, a: +c2.value, b: +c3.value};
      } else {
        colorData = colorFn[`oklab2${options.outputColorFormat}`]([+c1.value > 1 ? +c1.value / 100 : +c1.value, +c2.value, +c3.value])
      }

      break;
    case OKLCH_COLOR:
      [c1, c2, c3, , alpha] = node.nodes;

      alpha = alpha && alpha.value !== undefined ? +alpha.value : options.alwaysAlpha ? 1 : undefined;

      if (options.outputColorFormat === OKLCH_COLOR) {
        colorData = { l: +c1.value > 1 ? +c1.value / 100 : +c1.value, c: +c2.value, h: +c3.value};
      } else {
        colorData = colorFn[`oklch2${options.outputColorFormat}`]([+c1.value > 1 ? +c1.value / 100 : +c1.value, +c2.value, +c3.value])
      }

      break;
    default:
      break;
  }

  const newNode = node.clone({ type: 'word' });

  newNode.value = getFormattedString(
    colorData,
    options.outputColorFormat,
    alpha > 1 ? alpha / 100 : alpha,
    isUseModernSyntax,
  );

  return node.replaceWith(newNode);
}

module.exports = {
  convertColor,
};
