const postcss = require('postcss');
const valueParser = require('postcss-values-parser');
const colors = require('color-name');

const {
  convertingHEXColor,
  convertingRGBColor,
  convertingHSLColor,
  convertingKeywordColor,
} = require('./src/converts');
const {
  HEX_COLOR,
  RGB_COLOR,
  HSL_COLOR,
  KEYWORD_COLOR,
} = require('./src/constants');

const colorNames = Object.keys(colors);
const colorFormats = [HEX_COLOR, RGB_COLOR, HSL_COLOR, KEYWORD_COLOR];

const propsWithColorRegExp = /(background|border|shadow|color|fill|outline|@|\$)/;
const specValuesInParamsRegExp = /(\$|calc|var)/;

const defaultOptions = {
  outputColorFormat: '',
  alwaysAlpha: false,
  ignore: [],
};

module.exports = postcss.plugin('postcss-color-converter', (options = {}) => {
  const currentOptions = {
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
              if (
                !currentOptions.ignore.includes(HEX_COLOR) &&
                currentOptions.outputColorFormat !== HEX_COLOR &&
                node.isHex
              ) {
                node = convertingHEXColor(node, currentOptions);
              } else if (
                (
                  !currentOptions.ignore.includes(RGB_COLOR) &&
                  (currentOptions.alwaysAlpha || currentOptions.outputColorFormat !== RGB_COLOR)
                ) &&
                (node.name === 'rgb' || node.name === 'rgba') &&
                !specValuesInParamsRegExp.test(node.params)

              ) {
                node = convertingRGBColor(node, currentOptions);
              } else if (
                (
                  !currentOptions.ignore.includes(HSL_COLOR) &&
                  (currentOptions.alwaysAlpha || currentOptions.outputColorFormat !== HSL_COLOR)
                ) &&
                (node.name === 'hsl' || node.name === 'hsla') &&
                !specValuesInParamsRegExp.test(node.params)
              ) {
                node = convertingHSLColor(node, currentOptions);
              } else if (
                !currentOptions.ignore.includes(KEYWORD_COLOR) &&
                colorNames.includes(node.value)
              ) {
                node = convertingKeywordColor(node, currentOptions);
              }
            }
          });

          decl.value = valueObj.toString();
        }
      });
    }
  };
});
