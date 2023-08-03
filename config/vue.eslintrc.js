module.exports = {
  // 'vue/v-on-function-call': ['warn', 'always'], // 值得关注
  'vue/eqeqeq': 'error',
  'vue/component-definition-name-casing': ['warn', 'kebab-case'],
  'vue/match-component-file-name': 'warn',
  'vue/component-name-in-template-casing': [
    'error',
    'kebab-case',
    {
      registeredComponentsOnly: false,
    },
  ],
}
