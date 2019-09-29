module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: "eslint:recommended",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "no-unused-vars": 1,
    "no-redeclare": 1,
    "no-constant-condition": 0,
    "no-sparse-arrays": 0,
    "prefer-const": 2
  }
};
