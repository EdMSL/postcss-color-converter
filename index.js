const valueParser = require('postcss-values-parser');
const { isValidColor } = require('colorizr');

const {
  convertColor,
} = require('./src/converts');
const {
  HEX_COLOR,
  RGB_COLOR,
  HSL_COLOR,
  OKLCH_COLOR,
  KEYWORD_COLOR,
} = require('./src/constants');

const colorFormats = [HEX_COLOR, RGB_COLOR, HSL_COLOR, KEYWORD_COLOR];

const propsWithColorRegExp = /(background|border|shadow|color|fill|outline|@|--|\$)/;
const ignoredValuesRegExp = /(url)/;
const specValuesInParamsRegExp = /(\$|calc|var)/;

const defaultOptions = {
  outputColorFormat: '',
  alwaysAlpha: false,
  ignore: [],
};

module.exports = (options = {}) => {
  const currentOptions = {
    ...defaultOptions,
    ...options,
  };

  if (!currentOptions.outputColorFormat) {
    throw new Error(`'outputColorFormat' option is undefined.`)
  }

  if (!colorFormats.includes(currentOptions.outputColorFormat)) {
    throw new Error(`The specified value of 'outputColorFormat' is not contained in [${colorFormats.join()}].`)
  }

  return {
    postcssPlugin: 'postcss-color-converter',
    Declaration(decl) {
      if (
        decl.prop &&
        decl.value &&
        propsWithColorRegExp.test(decl.prop) &&
        !ignoredValuesRegExp.test(decl.value)
      ) {
        let valueObj = valueParser.parse(decl.value, { ignoreUnknownWords: true });

        valueObj.walk(node => {
          if (
            node.isColor &&
            ///BUG -0 value in a color function parameters interprets as a valid. Issue https://github.com/gilbarbara/colorizr/issues/19
            isValidColor(node.type === 'func' ? node.name + node.params : node.value)
          ) {
            let inputColorFormat;

            if (node.isHex) {
              inputColorFormat = HEX_COLOR;
            } else if (!node.isHex && node.type === 'word') {
              inputColorFormat = KEYWORD_COLOR;
            } else if (node.name === 'rgb' || node.name === 'rgba') {
              inputColorFormat = RGB_COLOR;
            } else if (node.name === 'hsl' || node.name === 'hsla') {
              inputColorFormat = HSL_COLOR;
            }

            if (
              inputColorFormat &&
              !currentOptions.ignore.includes(inputColorFormat) &&
              !(
                (inputColorFormat === RGB_COLOR || inputColorFormat === HSL_COLOR) &&
                specValuesInParamsRegExp.test(node.params)
              ) &&
              (
                currentOptions.alwaysAlpha ||
                currentOptions.outputColorFormat !== inputColorFormat
              )
            ) {
              node = convertColor(node, inputColorFormat, currentOptions);
            }
          }
        });

        decl.value = valueObj.toString();
      }
    }
  };
};

module.exports.postcss = true;
