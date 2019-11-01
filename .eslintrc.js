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
    "comma-dangle": [1, {
      arrays: "always-multiline",
      objects: "always-multiline",
      imports: "always-multiline",
      exports: "always-multiline",
      functions: "always-multiline",
    }],
    "max-len": [1, 100],
    "semi": [1, "always"],

    "prefer-let/prefer-let": 0,
  },
}
