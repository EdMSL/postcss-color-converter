const postcss = require('postcss');
const valueParser = require('postcss-values-parser');
const colors = require('color-name');

const {
  parseHEXAColor,
  getRGBColorStr,
  getHSLColorStr,
  getHEXColorStr,
} = require('./src/utils');

const colorNames = Object.keys(colors);
const colorFormats = ['hex', 'rgb', 'hsl', 'keyword'];

const DEFAULT_ALPHA = 1;
const propsWithColorRegExp = /(background|border|box-shadow|color|fill|outline|@|$)/;

const defaultOptions = {
  outputColorFormat: '',
  alwaysAlpha: false,
};

module.exports = postcss.plugin('postcss-color-converter', (options = {}) => {
  let currentOptions = {
    ...defaultOptions,
    ...options,
  };

  return style => {
    if (
      currentOptions.outputColorFormat &&
      colorFormats.includes(currentOptions.outputColorFormat)
    ) {
      style.walkDecls(decl => {
        if (
          decl.prop && propsWithColorRegExp.test(decl.prop) && decl.value
        ) {
          let valueObj = valueParser.parse(decl.value, { ignoreUnknownWords: true });

          valueObj.walk(node => {
            if (node.isColor) {
              if (currentOptions.outputColorFormat !== 'hex' && node.isHex) {
                const colorObj = parseHEXAColor(node.value);

                if (currentOptions.outputColorFormat === 'rgb') {
                  node.value = currentOptions.alwaysAlpha || colorObj.hexAlpha !== 'ff'
                    ? getRGBColorStr('hex', colorObj.hexColor, colorObj.hexAlpha)
                    : getRGBColorStr('hex', colorObj.hexColor);
                } else if (currentOptions.outputColorFormat === 'hsl') {
                  node.value = currentOptions.alwaysAlpha || colorObj.hexAlpha !== 'ff'
                    ? getHSLColorStr('hex', colorObj.hexColor, colorObj.hexAlpha)
                    : getHSLColorStr('hex', colorObj.hexColor);
                }
              } else if (
                (currentOptions.alwaysAlpha || currentOptions.outputColorFormat !== 'rgb') &&
                (node.name === 'rgb' || node.name === 'rgba')
              ) {
                const newNode = node.clone({ type: 'word' });
                // same as [+node.nodes[0].value, +node.nodes[2].value, +node.nodes[4].value], +node.nodes[6].value,
                // but node.nodes[6].value can be only in rgba or hsla otherwise undefined
                const [r, , g, , b, , a] = node.nodes;

                if (currentOptions.outputColorFormat === 'hex') {
                  newNode.value = getHEXColorStr(
                    'rgb',
                    [+r.value, +g.value, +b.value],
                    ((a && +a.value) || (currentOptions.alwaysAlpha && DEFAULT_ALPHA)),
                  );
                } else if (currentOptions.outputColorFormat === 'hsl') {
                  newNode.value = getHSLColorStr(
                    'rgb',
                    [+r.value, +g.value, +b.value],
                    ((a && +a.value) || (currentOptions.alwaysAlpha && DEFAULT_ALPHA)),
                  );
                } else if (currentOptions.outputColorFormat === 'rgb') {
                  newNode.value = getRGBColorStr(
                    'rgb',
                    [+r.value, +g.value, +b.value],
                    (a && +a.value) || DEFAULT_ALPHA,
                  );
                }

                node.replaceWith(newNode);
              } else if (
                (currentOptions.alwaysAlpha || currentOptions.outputColorFormat !== 'hsl') &&
                (node.name === 'hsl' || node.name === 'hsla')
              ) {
                const newNode = node.clone({ type: 'word' });
                const [h, , s, , l, , a] = node.nodes;

                if (currentOptions.outputColorFormat === 'hex') {
                  newNode.value = getHEXColorStr(
                    'hsl',
                    [+h.value, +s.value, +l.value],
                    ((a && +a.value) || (currentOptions.alwaysAlpha && DEFAULT_ALPHA)),
                  );
                } else if (currentOptions.outputColorFormat === 'rgb') {
                  newNode.value = getRGBColorStr(
                    'hsl',
                    [+h.value, +s.value, +l.value],
                    ((a && +a.value) || (currentOptions.alwaysAlpha && DEFAULT_ALPHA)),
                  );
                } else if (currentOptions.outputColorFormat === 'hsl') {
                  newNode.value = getHSLColorStr(
                    'hsl',
                    [+h.value, +s.value, +l.value],
                    (a && +a.value) || DEFAULT_ALPHA,
                  );
                }

                node.replaceWith(newNode);
              } else if (colorNames.includes(node.value)) {
                if (currentOptions.outputColorFormat === 'hex') {
                  node.value = getHEXColorStr(
                    'keyword',
                    node.value,
                    currentOptions.alwaysAlpha && DEFAULT_ALPHA,
                  );
                } else if (currentOptions.outputColorFormat === 'rgb') {
                  node.value = getRGBColorStr(
                    'keyword',
                    node.value,
                    currentOptions.alwaysAlpha && DEFAULT_ALPHA,
                  );
                } else if (currentOptions.outputColorFormat === 'hsl') {
                  node.value = getHSLColorStr(
                    'keyword',
                    node.value,
                    currentOptions.alwaysAlpha && DEFAULT_ALPHA,
                  );
                }
              }
            }
          });

          decl.value = valueObj.toString();
        }
      });
    } else {
      console.log('Сolor output format not provided or not supported, the plugin will do nothing');
    }
  };
});
