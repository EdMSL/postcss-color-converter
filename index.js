import valueParser from 'postcss-values-parser';
import colors from 'color-name';

import {
  convertingHEXColor,
  convertingRGBColor,
  convertingHSLColor,
  convertingKeywordColor,
} from './src/converts.js';
import {
  HEX_COLOR,
  RGB_COLOR,
  HSL_COLOR,
  KEYWORD_COLOR,
} from './src/constants.js';

const colorNames = Object.keys(colors);
const colorFormats = [HEX_COLOR, RGB_COLOR, HSL_COLOR, KEYWORD_COLOR];

const propsWithColorRegExp = /(background|border|shadow|color|fill|outline|@|--|\$)/;
const ignoredValuesRegExp = /(url)/;
const specValuesInParamsRegExp = /(\$|calc|var)/;

const defaultOptions = {
  outputColorFormat: '',
  alwaysAlpha: false,
  ignore: [],
};

const plugin = (options = {}) => {
  const currentOptions = {
    ...defaultOptions,
    ...options,
  };

  if (!currentOptions.outputColorFormat) {
    throw new Error(`'outputColorFormat' option is undefined.`);
  }

  if (!colorFormats.includes(currentOptions.outputColorFormat)) {
    throw new Error(`The specified value of 'outputColorFormat' is not contained in [${colorFormats.join(',')}].`);
  }

  return {
    postcssPlugin: 'postcss-color-converter',
    Declaration (decl) {
      if (
        !decl.prop || !propsWithColorRegExp.test(decl.prop) || !decl.value || ignoredValuesRegExp.test(decl.value)
      ) {
        return;
      }

      let valueObject = valueParser.parse(decl.value, { ignoreUnknownWords: true });

      valueObject.walk(node => {
        if (!node.isColor) {
          return;
        }

        if (
          !currentOptions.ignore.includes(HEX_COLOR) &&
          currentOptions.outputColorFormat !== HEX_COLOR &&
          node.isHex
        ) {
          node = convertingHEXColor(node, currentOptions);
          return;
        }

        if (
          (
            !currentOptions.ignore.includes(RGB_COLOR) &&
            (
              currentOptions.alwaysAlpha ||
              currentOptions.outputColorFormat !== RGB_COLOR
            )
          ) &&
          (node.name === 'rgb' || node.name === 'rgba') &&
          !specValuesInParamsRegExp.test(node.params)

        ) {
          node = convertingRGBColor(node, currentOptions);
          return;
        }

        if (
          (
            !currentOptions.ignore.includes(HSL_COLOR) &&
            (
              currentOptions.alwaysAlpha ||
              currentOptions.outputColorFormat !== HSL_COLOR
            )
          ) &&
          (node.name === 'hsl' || node.name === 'hsla') &&
          !specValuesInParamsRegExp.test(node.params)
        ) {
          node = convertingHSLColor(node, currentOptions);
          return;
        }

        if (
          !currentOptions.ignore.includes(KEYWORD_COLOR) &&
          colorNames.includes(node.value)
        ) {
          node = convertingKeywordColor(node, currentOptions);
        }
      });

      decl.value = valueObject.toString();
    },
  };
};

plugin.postcss = true;

export default plugin;
