const {
  parseHEXAColor,
  getRGBColorStr,
  getHSLColorStr,
  getHEXColorStr,
  convertHEXAlphaValueToNumber,
} = require('./utils');
const {
  DEFAULT_HEX_ALPHA,
  DEFAULT_ALPHA,
  HEX_COLOR,
  RGB_COLOR,
  HSL_COLOR,
  OKLCH_COLOR,
  KEYWORD_COLOR,
} = require('./constants');

const convertingHEXColor = (node, options) => {
  const colorObj = parseHEXAColor(node.value);

  if (options.outputColorFormat === RGB_COLOR) {
    node.value = getRGBColorStr(
      HEX_COLOR,
      colorObj.hexColor,
      options.alwaysAlpha || colorObj.hexAlpha !== DEFAULT_HEX_ALPHA ? convertHEXAlphaValueToNumber(colorObj.hexAlpha) : false,
    )
  } else if (options.outputColorFormat === HSL_COLOR) {
    node.value = getHSLColorStr(
      HEX_COLOR,
      colorObj.hexColor,
      options.alwaysAlpha || colorObj.hexAlpha !== DEFAULT_HEX_ALPHA ? convertHEXAlphaValueToNumber(colorObj.hexAlpha) : false,
    );
  }

  return node;
};

const convertingRGBColor = (node, options) => {
  const newNode = node.clone({ type: 'word' });
  const isModernSyntax = !node.nodes.join(' ').includes(',');
  let r,g,b,a;

  if (!isModernSyntax) {
    [r, , g, , b, , a] = node.nodes;
  } else {
    [r, g, b, , a] = node.nodes;
  }

  if (options.outputColorFormat === HEX_COLOR) {
    newNode.value = getHEXColorStr(
      RGB_COLOR,
      [+r.value, +g.value, +b.value],
      ((a && +a.value !== DEFAULT_ALPHA && a.value)),
    );
  } else if (options.outputColorFormat === HSL_COLOR) {
    newNode.value = getHSLColorStr(
      RGB_COLOR,
      [+r.value, +g.value, +b.value],
      ((a && a.value) || (options.alwaysAlpha && DEFAULT_ALPHA)),
      isModernSyntax
    );
  } else if (options.outputColorFormat === RGB_COLOR) {
    newNode.value = getRGBColorStr(
      RGB_COLOR,
      [+r.value, +g.value, +b.value],
      (a && a.value) || (options.alwaysAlpha && DEFAULT_ALPHA),
      isModernSyntax
    );
  }

  node.replaceWith(newNode);

  return node;
};

const convertingHSLColor = (node, options) => {
  const newNode = node.clone({ type: 'word' });
  let h,s,l,a;
  const isModernSyntax = !node.nodes.join(' ').includes(',');

  if (!isModernSyntax) {
    [h, , s, , l, , a] = node.nodes;
  } else {
    [h, s, l, , a] = node.nodes;
  }

  if (options.outputColorFormat === HEX_COLOR) {
    newNode.value = getHEXColorStr(
      HSL_COLOR,
      [+h.value, +s.value, +l.value],
      ((a && +a.value !== DEFAULT_ALPHA && a.value)),
    );
  } else if (options.outputColorFormat === RGB_COLOR) {
    newNode.value = getRGBColorStr(
      HSL_COLOR,
      [+h.value, +s.value, +l.value],
      ((a && a.value) || (options.alwaysAlpha && DEFAULT_ALPHA)),
      isModernSyntax
    );
  } else if (options.outputColorFormat === HSL_COLOR) {
    newNode.value = getHSLColorStr(
      HSL_COLOR,
      [+h.value, +s.value, +l.value],
      (a && a.value) || (options.alwaysAlpha && DEFAULT_ALPHA),
      isModernSyntax
    );
  }

  node.replaceWith(newNode);

  return node;
};

const convertingOKLCHColor = (node, options) => {
  const newNode = node.clone({ type: 'word' });
  let l,c,h,a;
  const isModernSyntax = !node.nodes.join(' ').includes(',');

  if (!isModernSyntax) {
    [l, , c, , h, , a] = node.nodes;
  } else {
    [l, c, h, , a] = node.nodes;
  }

  if (options.outputColorFormat === HEX_COLOR) {
    newNode.value = getHEXColorStr(
      OKLCH_COLOR,
      [+l.value, +c.value, +h.value],
      ((a && +a.value !== DEFAULT_ALPHA && a.value)),
    );
  } else if (options.outputColorFormat === RGB_COLOR) {
    newNode.value = getRGBColorStr(
      OKLCH_COLOR,
      [+l.value, +c.value, +h.value],
      ((a && a.value) || (options.alwaysAlpha && DEFAULT_ALPHA)),
      false
    );
  } else if (options.outputColorFormat === HSL_COLOR) {
    newNode.value = getHSLColorStr(
      OKLCH_COLOR,
      [+l.value, +h.value, +c.value],
      (a && a.value) || (options.alwaysAlpha && DEFAULT_ALPHA),
      false
    );
  }

  node.replaceWith(newNode);

  return node;
};

const convertingKeywordColor = (node, options) => {
  if (options.outputColorFormat === HEX_COLOR) {
    node.value = getHEXColorStr(
      KEYWORD_COLOR,
      node.value,
    );
  } else if (options.outputColorFormat === RGB_COLOR) {
    node.value = getRGBColorStr(
      KEYWORD_COLOR,
      node.value,
      options.alwaysAlpha && DEFAULT_ALPHA,
      options.isUseModernSyntax,
    );
  } else if (options.outputColorFormat === HSL_COLOR) {
    node.value = getHSLColorStr(
      KEYWORD_COLOR,
      node.value,
      options.alwaysAlpha && DEFAULT_ALPHA,
      options.isUseModernSyntax,
    );
  }

  return node;
};

module.exports = {
  convertingHEXColor,
  convertingRGBColor,
  convertingHSLColor,
  convertingOKLCHColor,
  convertingKeywordColor,
};
