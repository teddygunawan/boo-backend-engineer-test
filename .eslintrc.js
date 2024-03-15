'use strict';

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    mocha: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
      excludedFiles: 'node_modules/*',
    },
    {
      files: ['*.test.js', '*.spec.js'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    strict: ['error', 'global'], // Enforce strict mode
    'no-console': 'off',
    'operator-linebreak': 'off',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', '.']],
        extensions: ['.ts', '.js', '.jsx', '.json'],
      },
    },
  },
  plugins: ['mocha'],
};
