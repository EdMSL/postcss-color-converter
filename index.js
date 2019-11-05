const postcss = require('postcss');
const valueParser = require('postcss-values-parser');
const convert = require('color-convert');

const { getRGBColorStr, getHSLColorStr } = require('./src/utils');
const { CSS_COLOR_NAMES, colorFormats } = require('./src/colors');

const regexpHEX = /#([a-f\d]{3}|[a-f\d]{6})$/i;
const regexpHEXAlpha = /#([a-f\d]{4}|[a-f\d]{8})$/i;
const regexpRGB = /rgb\(/;
const regexpHSL = /hsl\(/;

const defaultOptions = {
  syntax: '',
  outputColorFormat: '',
};

module.exports = postcss.plugin('postcss-color-converter', (opts = {}) => {
  let currentOptions = {
    ...defaultOptions,
    ...opts,
  };

  return style => {
    if (
      currentOptions.outputColorFormat &&
      colorFormats.includes(currentOptions.outputColorFormat)
    ) {
      style.walkDecls(decl => {
        let value = decl.value;

        if (value) {
          let newValue = valueParser.parse(value);

          if (regexpHEX.test(value)) {
            newValue.walk(node => {
              if (node.type === 'word' && node.isColor && node.isHex) {
                if (currentOptions.outputColorFormat === 'rgb') {
                  node.value = getRGBColorStr(node.value, 'hex');
                }
                if (currentOptions.outputColorFormat === 'hsl') {
                  node.value = getHSLColorStr(node.value, 'hex');
                }
              }
            });
          }

          if (regexpRGB.test(value)) {
            newValue.walk(node => {
              if (node.type === 'word' && node.isColor) {
                if (currentOptions.outputColorFormat === 'hex') {
                  const newNode = node.clone({ type: 'word' });
                  newNode.value = `#${ convert.rgb.hex(node.nodes[0], node.nodes[2], node.nodes[4]) }`;
                  node.replaceWith(newNode);
                }
                if (currentOptions.outputColorFormat === 'hsl') {
                  node.value = getHSLColorStr(node.value, 'rgb');
                }
              }
            });
          }

          if (regexpHSL.test(value) && currentOptions.outputColorFormat === 'rgb') {
            newValue.walk(node => {
              if (node.type === 'word' && node.isColor && node.isHex) {
                node.value = `rgb(${ convert.hex.rgb(node.value).join(', ') })`;
              }
            });
          }

          decl.value = newValue.toString();
        }
      });
    } else {
      console.log('Сolor output format not provided, the plugin will do nothing');
    }
  };
});
