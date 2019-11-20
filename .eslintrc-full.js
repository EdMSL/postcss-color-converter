module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
  },
  env: {
    node: true,
    es6: true,
    mocha: true,
  },
  extends: [
    "eslint-config-postcss",
  ],
  rules: {
    "arrow-parens": 0,
    "comma-dangle": [2, {
      arrays: "always-multiline",
      objects: "always-multiline",
      imports: "always-multiline",
      exports: "always-multiline",
      functions: "always-multiline",
    }],
    "func-style": 0,
    "max-len": [1, 100],
    "multiline-ternary": [1, 'always'],
    "semi": [2, "always"],

    "prefer-let/prefer-let": 0,
  },
}
