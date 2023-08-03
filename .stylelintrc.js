module.exports = {
  root: true,
  extends: ['stylelint-config-recommended-scss'],
  rules: {
    'selector-pseudo-element-no-unknown': [true, {
      ignorePseudoElements: ['v-deep'],
    }],
    'number-leading-zero': 'always',
  },
}
