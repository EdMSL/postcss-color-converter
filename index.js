const postcss = require('postcss');
const valueParser = require('postcss-values-parser');

const {
  parseHEXAColor,
  getRGBColorStr,
  getHSLColorStr,
  getHEXColorStr,
} = require('./src/utils');
const { CSS_COLOR_NAMES, colorFormats } = require('./src/colors');

const fullHEXRegExp = /#([a-f\d]{3}|[a-f\d]{4}|[a-f\d]{6}|[a-f\d]{8})($|\s)/i;
const fullRGBRegExp = /rgba?\(/;
const fullHSLRegExp = /hsla?\(/;

const defaultOptions = {
  syntax: '',
  outputColorFormat: '',
  alwaysAlpha: false,
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
        if (
          decl.value && (
            fullHEXRegExp.test(decl.value) ||
            fullRGBRegExp.test(decl.value) ||
            fullHSLRegExp.test(decl.value)
          )
        ) {
          let valueObj = valueParser.parse(decl.value);

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
                currentOptions.outputColorFormat !== 'rgb' &&
                (node.name === 'rgb' || node.name === 'rgba')
              ) {
                const newNode = node.clone({ type: 'word' });

                // same as [+node.nodes[0].value, +node.nodes[2].value, +node.nodes[4].value], +node.nodes[6].value,
                const [r, , g, , b, , a] = node.nodes;

                if (currentOptions.outputColorFormat === 'hex') {
                  if (node.name === 'rgb') {
                    newNode.value = getHEXColorStr(
                      'rgb',
                      [+r.value, +g.value, +b.value],
                    );
                  } else if (node.name === 'rgba') {
                    newNode.value = getHEXColorStr(
                      'rgb',
                      [+r.value, +g.value, +b.value],
                      +a.value,
                    );
                  }
                } else if (currentOptions.outputColorFormat === 'hsl') {
                  if (node.name === 'rgb') {
                    newNode.value = getHSLColorStr(
                      'rgb',
                      [+r.value, +g.value, +b.value],
                    );
                  } else if (node.name === 'rgba') {
                    newNode.value = getHSLColorStr(
                      'rgb',
                      [+r.value, +g.value, +b.value],
                      +a.value,
                    );
                  }
                }

                node.replaceWith(newNode);
              } else if (
                currentOptions.outputColorFormat !== 'hsl' &&
                (node.name === 'hsl' || node.name === 'hsla')
              ) {
                const newNode = node.clone({ type: 'word' });
                const [h, , s, , l, , a] = node.nodes;

                if (currentOptions.outputColorFormat === 'hex') {
                  if (node.name === 'hsl') {
                    newNode.value = getHEXColorStr(
                      'hsl',
                      [+h.value, +s.value, +l.value],
                    );
                  } else if (node.name === 'hsla') {
                    newNode.value = getHEXColorStr(
                      'hsl',
                      [+h.value, +s.value, +l.value],
                      +a.value,
                    );
                  }
                } else if (currentOptions.outputColorFormat === 'rgb') {
                  if (node.name === 'hsl') {
                    newNode.value = getRGBColorStr(
                      'hsl',
                      [+h.value, +s.value, +l.value],
                    );
                  } else if (node.name === 'hsla') {
                    newNode.value = getRGBColorStr(
                      'hsl',
                      [+node.nodes[0].value, +node.nodes[2].value, +node.nodes[4].value],
                      +a.value,
                    );
                  }
                }

                node.replaceWith(newNode);
              }
            }
          });

          decl.value = valueObj.toString();
        }
      });
    } else {
      console.log('Сolor output format not provided, the plugin will do nothing');
    }
  };
});
