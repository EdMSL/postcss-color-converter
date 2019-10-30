const postcss = require('postcss');
const valueParser = require('postcss-values-parser');
const convert = require('color-convert');

const regexpHEX = /#([a-f\d]{3}|[a-f\d]{6})$/i;
const regexpHEXAlpha = /#([a-f\d]{4}|[a-f\d]{8})$/i;
const regexpRGB = /rgb\(/;
const regexpHSL = /hsl\(/;

const defaultOptions = {
  syntax: '',
  outputColorFormat: ''
};

module.exports = postcss.plugin('postcss-color-converter', (opts = {}) => {
  let currentOptions = {
    ...defaultOptions,
    ...opts
  };

  return style => {
    style.walkDecls(decl => {
      let value = decl.value;

      if (value) {
        let newValue = valueParser.parse(value);

        if (regexpHEX.test(value) && currentOptions.outputColorFormat === 'rgb') {
          newValue.walk(node => {
            if (node.type === 'word' && node.isColor && node.isHex) {
              node.value = `rgb(${ convert.hex.rgb(node.value).join(', ') })`;
            }
          });
        }

        if (regexpRGB.test(value) && currentOptions.outputColorFormat === 'hex') {
          newValue.walk(node => {
            if (node.type === 'func' && node.isColor) {
              const newNode = node.clone({ type: 'word' });
              newNode.value = `#${ convert.rgb.hex(node.nodes[0], node.nodes[2], node.nodes[4]) }`;
              node.replaceWith(newNode);
              // console.log(newNode)
            }
          });
        }

        decl.value = newValue.toString();
      }
    });
  };
});
