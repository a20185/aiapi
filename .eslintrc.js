const { defineConfig } = require('eslint-define-config');
const vue = require('./config/vue.eslintrc')
const vue2to3 = require('./config/vue2to3.eslintrc')
const typescript = require('./config/typescript.eslintrc')
const tsdoc = require('./config/tsdoc.eslintrc.js')

module.exports = defineConfig({
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ['eslint-plugin-tsdoc'],
  rules: {
    ...typescript,
    ...vue,
    ...vue2to3,
    'require-atomic-updates': 'off', // new rule by 20210402, off it
    'vue/v-slot-style': 'off',
    'no-console': 'off',
    'no-debugger': 'error',
    'max-params': ['error', 3],
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
      rules: {
        complexity: 'off',
        'max-lines': 'off',
        'max-lines-per-function': 'off',
        'max-depth': 'off',
      },
    }
  ],
})
