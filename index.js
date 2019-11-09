const postcss = require('postcss');
const valueParser = require('postcss-values-parser');

const {
  parseHEXAColor,
  getRGBColorStr,
  getHSLColorStr,
  getRGBAColorStr,
  getHSLAColorStr,
  getHEXColorStr,
  getHEXAColorStr,
} = require('./src/utils');
const { CSS_COLOR_NAMES, colorFormats } = require('./src/colors');

const HEXRegExp = /#([a-f\d]{3}|[a-f\d]{6})($|\s)/i;
const HEXARegExp = /#([a-f\d]{4}|[a-f\d]{8})($|\s)/i;
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

          if (fullHEXRegExp.test(decl.value)) {
            valueObj.walk(node => {
              if (node.type === 'word' && node.isColor && node.isHex) {
                const colorObj = parseHEXAColor(node.value);

                if (HEXRegExp.test(node.value)) {
                  if (currentOptions.outputColorFormat === 'rgb') {
                    node.value = currentOptions.alwaysAlpha
                      ? getRGBAColorStr(colorObj.hexColor, colorObj.hexAlpha, 'hex')
                      : getRGBColorStr(colorObj.hexColor, 'hex');
                  } else if (currentOptions.outputColorFormat === 'hsl') {
                    node.value = currentOptions.alwaysAlpha
                      ? getHSLAColorStr(colorObj.hexColor, colorObj.hexAlpha, 'hex')
                      : getHSLColorStr(colorObj.hexColor, 'hex');
                  }
                } else if (HEXARegExp.test(node.value)) {
                  if (currentOptions.outputColorFormat === 'rgb') {
                    node.value = getRGBAColorStr(colorObj.hexColor, colorObj.hexAlpha, 'hex');
                  } else if (currentOptions.outputColorFormat === 'hsl') {
                    node.value = getHSLAColorStr(colorObj.hexColor, colorObj.hexAlpha, 'hex');
                  }
                }
              }
            });
          }

          if (fullRGBRegExp.test(decl.value)) {
            valueObj.walk(node => {
              if (node.type === 'func' && node.isColor) {
                if (currentOptions.outputColorFormat === 'hex') {
                  if (node.name === 'rgb') {
                    node.value = getHEXColorStr(
                      [+node.nodes[0].value, +node.nodes[2].value, +node.nodes[4].value],
                      'rgb',
                    );
                  } else if (node.name === 'rgba') {
                    node.value = getHEXAColorStr(
                      [+node.nodes[0].value, +node.nodes[2].value, +node.nodes[4].value],
                      +node.nodes[6].value,
                      'rgb',
                    );
                  }
                }
                if (currentOptions.outputColorFormat === 'hsl') {
                  if (node.name === 'rgb') {
                    node.value = getHSLColorStr(
                      [+node.nodes[0].value, +node.nodes[2].value, +node.nodes[4].value],
                      'rgb',
                    );
                  } else if (node.name === 'rgba') {
                    node.value = getHSLAColorStr(
                      [+node.nodes[0].value, +node.nodes[2].value, +node.nodes[4].value],
                      +node.nodes[6].value,
                      'rgb',
                    );
                  }
                }
              }
            });
          }

          if (fullHSLRegExp.test(decl.value)) {
            valueObj.walk(node => {
              if (node.type === 'func' && node.isColor) {
                if (currentOptions.outputColorFormat === 'hex') {
                  if (node.name === 'hsl') {
                    node.value = getHEXColorStr(
                      [+node.nodes[0].value, +node.nodes[2].value, +node.nodes[4].value],
                      'hsl',
                    );
                  } else if (node.name === 'hsla') {
                    node.value = getHEXAColorStr(
                      [+node.nodes[0].value, +node.nodes[2].value, +node.nodes[4].value],
                      +node.nodes[6].value,
                      'hsl',
                    );
                  }
                }
                if (currentOptions.outputColorFormat === 'rgb') {
                  if (node.name === 'hsl') {
                    node.value = getRGBColorStr(
                      [+node.nodes[0].value, +node.nodes[2].value, +node.nodes[4].value],
                      'hsl',
                    );
                  } else if (node.name === 'hsla') {
                    node.value = getRGBAColorStr(
                      [+node.nodes[0].value, +node.nodes[2].value, +node.nodes[4].value],
                      +node.nodes[6].value,
                      'hsl',
                    );
                  }
                }
              }
            });
          }

          decl.value = valueObj.toString();
        }
      });
    } else {
      console.log('Сolor output format not provided, the plugin will do nothing');
    }
  };
});
