import {
  parseHEXAColor,
  getRGBColorStr as getRGBColorString,
  getHSLColorStr as getHSLColorString,
  getHEXColorStr as getHEXColorString,
  convertHEXAlphaValueToNumber,
} from './utils.js';
import {
  DEFAULT_HEX_ALPHA,
  DEFAULT_ALPHA,
  HEX_COLOR,
  RGB_COLOR,
  HSL_COLOR,
  KEYWORD_COLOR,
} from './constants.js';

export function convertingHEXColor(node, options) {
  const colorObject = parseHEXAColor(node.value);
  const isAlpha = options.alwaysAlpha || colorObject.hexAlpha !== DEFAULT_HEX_ALPHA;

  if (options.outputColorFormat === RGB_COLOR) {
    node.value = getRGBColorString(
      HEX_COLOR,
      colorObject.hexColor,
      isAlpha
        ? convertHEXAlphaValueToNumber(colorObject.hexAlpha)
        : false,
    );
  } else if (options.outputColorFormat === HSL_COLOR) {
    node.value = getHSLColorString(
      HEX_COLOR,
      colorObject.hexColor,
      isAlpha
        ? convertHEXAlphaValueToNumber(colorObject.hexAlpha)
        : false,
    );
  }

  return node;
}

export function convertingRGBColor(node, options) {
  const newNode = node.clone({ type: 'word' });
  const isModernSyntax = !node.nodes.join(' ').includes(',');
  let r,g,b,a;

  if (isModernSyntax) {
    [r, g, b, , a] = node.nodes;
  } else {
    [r, , g, , b, , a] = node.nodes;
  }

  switch (options.outputColorFormat) {
    case HEX_COLOR:
      newNode.value = getHEXColorString(
        RGB_COLOR,
        [+r.value, +g.value, +b.value],
        ((a && +a.value !== DEFAULT_ALPHA && a.value)),
      );

      break;
    case HSL_COLOR:
      newNode.value = getHSLColorString(
        RGB_COLOR,
        [+r.value, +g.value, +b.value],
        ((a && a.value) || (options.alwaysAlpha && DEFAULT_ALPHA)),
        isModernSyntax,
      );

      break;
    case RGB_COLOR:
      newNode.value = getRGBColorString(
        RGB_COLOR,
        [+r.value, +g.value, +b.value],
        (a && a.value) || (options.alwaysAlpha && DEFAULT_ALPHA),
        isModernSyntax,
      );

      break;
    // No default
  }

  node.replaceWith(newNode);

  return node;
}

export function convertingHSLColor(node, options) {
  const newNode = node.clone({ type: 'word' });
  let h,s,l,a;
  const isModernSyntax = !node.nodes.join(' ').includes(',');

  if (isModernSyntax) {
    [h, s, l, , a] = node.nodes;
  } else {
    [h, , s, , l, , a] = node.nodes;
  }

  switch (options.outputColorFormat) {
    case HEX_COLOR:
      newNode.value = getHEXColorString(
        HSL_COLOR,
        [+h.value, +s.value, +l.value],
        ((a && +a.value !== DEFAULT_ALPHA && a.value)),
      );

      break;
    case RGB_COLOR:
      newNode.value = getRGBColorString(
        HSL_COLOR,
        [+h.value, +s.value, +l.value],
        ((a && a.value) || (options.alwaysAlpha && DEFAULT_ALPHA)),
        isModernSyntax,
      );

      break;
    case HSL_COLOR:
      newNode.value = getHSLColorString(
        HSL_COLOR,
        [+h.value, +s.value, +l.value],
        (a && a.value) || (options.alwaysAlpha && DEFAULT_ALPHA),
        isModernSyntax,
      );

      break;
    // No default
  }

  node.replaceWith(newNode);

  return node;
}

export function convertingKeywordColor(node, options) {
  switch (options.outputColorFormat) {
    case HEX_COLOR:
      node.value = getHEXColorString(
        KEYWORD_COLOR,
        node.value,
      );

      break;
    case RGB_COLOR:
      node.value = getRGBColorString(
        KEYWORD_COLOR,
        node.value,
        options.alwaysAlpha && DEFAULT_ALPHA,
        options.isUseModernSyntax,
      );

      break;
    case HSL_COLOR:
      node.value = getHSLColorString(
        KEYWORD_COLOR,
        node.value,
        options.alwaysAlpha && DEFAULT_ALPHA,
        options.isUseModernSyntax,
      );

      break;
    // No default
  }

  return node;
}
