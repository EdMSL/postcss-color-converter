import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import nodePlugin from "eslint-plugin-n";
import pluginPromise from 'eslint-plugin-promise';
import pluginSecurity from 'eslint-plugin-security';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  ...nodePlugin.configs["flat/mixed-esm-and-cjs"],
  pluginPromise.configs['flat/recommended'],
  pluginSecurity.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2018,
      },
      globals: {
        ...globals.builtin,
        node: true,
        es6: true,
        mocha: true,
      },
    },
    rules: {
      "arrow-parens": 0,
      "comma-dangle": [1, {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "always-multiline",
      }],
      "func-style": 0,
      "max-len": [1, 100],
      "multiline-ternary": [1, 'always'],
      semi: [1, "always"],

      "import/namespace": 0,
    },
    ignores: [
      'node_modules/**/*.{js,mjs,cjs,ts}',
      '.vscode',
      '.reports/**/*.{js,mjs,cjs,ts}',
      '.reports/*.{js,mjs,cjs,ts}'
    ],
  },
];
