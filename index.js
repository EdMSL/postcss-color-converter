const valueParser = require('postcss-values-parser');
const { isValidColor } = require('colorizr');

// const colors = require('color-name');

const {
  // convertHEXColor,
  // convertRGBColor,
  // convertHSLColor,
  // convertKeywordColor,
  convertColor,
} = require('./src/converts');
const {
  HEX_COLOR,
  RGB_COLOR,
  HSL_COLOR,
  KEYWORD_COLOR,
} = require('./src/constants');

// const colorNames = Object.keys(colors);
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
    Declaration (decl) {
      if (
        decl.prop && propsWithColorRegExp.test(decl.prop) && decl.value && !ignoredValuesRegExp.test(decl.value)
      ) {
        let valueObj = valueParser.parse(decl.value, { ignoreUnknownWords: true });

        valueObj.walk(node => {
          if (node.isColor) {
            let inputColorFormat;

            if (node.isHex) {
              inputColorFormat = HEX_COLOR;
            } else if (!node.isHex && node.type === 'word' && isValidColor(node.value)) {
              inputColorFormat = KEYWORD_COLOR;
            } else if (node.name === 'rgb' || node.name === 'rgba') {
              inputColorFormat = RGB_COLOR;
            } else if (node.name === 'hsl' || node.name === 'hsla') {
              inputColorFormat = HSL_COLOR;
            }

            if (
              inputColorFormat &&
              !currentOptions.ignore.includes(inputColorFormat) &&
              (
                (currentOptions.alwaysAlpha ||
                currentOptions.outputColorFormat !== inputColorFormat) && ((inputColorFormat !== KEYWORD_COLOR || inputColorFormat !== HEX_COLOR) &&!specValuesInParamsRegExp.test(node.params))
              )

              // ((inputColorFormat === RGB_COLOR || inputColorFormat === HSL_COLOR) && !specValuesInParamsRegExp.test(node.params))
            ) {

                node = convertColor(node, inputColorFormat, currentOptions);
              // if (
              //   // !currentOptions.ignore.includes(HEX_COLOR) &&
              //   currentOptions.outputColorFormat !== HEX_COLOR &&
              //   node.isHex
              // ) {
              //   // node = convertColor(node, HEX_COLOR, currentOptions);
              //   node = convertColor(node, inputColorFormat, currentOptions);
              //   // node = convertHEXColor(node, currentOptions);
              // } else if (
              //   // (
              //   //   // !currentOptions.ignore.includes(RGB_COLOR) &&
              //   //   (
              //   //     currentOptions.alwaysAlpha ||
              //   //     currentOptions.outputColorFormat !== RGB_COLOR
              //   //   )
              //   // ) &&
              //   // (node.name === 'rgb' || node.name === 'rgba') &&
              //   // !specValuesInParamsRegExp.test(node.params)

              // ) {
              //   // node = convertColor(node, RGB_COLOR, currentOptions);
              //   node = convertColor(node, inputColorFormat, currentOptions);
              //   // node = convertRGBColor(node, currentOptions);
              // } else if (
              //   // (
              //   //   // !currentOptions.ignore.includes(HSL_COLOR) &&
              //   //   (
              //   //     currentOptions.alwaysAlpha ||
              //   //     currentOptions.outputColorFormat !== HSL_COLOR
              //   //   )
              //   // ) &&
              //   (node.name === 'hsl' || node.name === 'hsla') &&
              //   !specValuesInParamsRegExp.test(node.params)
              // ) {
              //   // node = convertColor(node, HSL_COLOR, currentOptions);
              //   node = convertColor(node, inputColorFormat, currentOptions);
              //   // node = convertHSLColor(node, currentOptions);
              // } else if (
              //   inputColorFormat === KEYWORD_COLOR
              //   // !currentOptions.ignore.includes(KEYWORD_COLOR) &&
              //   // node.type === 'word' && !node.isHex &&
              //   // isValidColor(node.value)
              //   // colorNames.includes(node.value)
              // ) {
              //   // node = convertColor(node, KEYWORD_COLOR, currentOptions);
              //   node = convertColor(node, inputColorFormat, currentOptions);
              //   // node = convertKeywordColor(node, currentOptions);
              // }
            }
          }
        });

        decl.value = valueObj.toString();
      }
    }
  };
};

module.exports.postcss = true;
