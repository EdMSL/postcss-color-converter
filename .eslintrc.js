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
    "max-len": [1, 100],
    "semi": [1, "always"],

    "prefer-let/prefer-let": 0,
  },
}
