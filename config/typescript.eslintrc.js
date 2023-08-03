module.exports = {
  // need type-check
  '@typescript-eslint/prefer-ts-expect-error': 'warn',
  '@typescript-eslint/no-var-requires': 'off',
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/consistent-type-imports': [
    'error',
    {
      prefer: 'type-imports',
      disallowTypeAnnotations: true,
    },
  ],
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/array-type': ['warn', undefined],
  '@typescript-eslint/no-empty-function': 'off',
  '@typescript-eslint/member-ordering': [
    'warn',
    {
      default: [
        'public-method', // = ["public-static-method", "public-instance-method"]
        'protected-method', // = ["protected-static-method", "protected-instance-method"]
        'private-method', // = ["private-static-method", "private-instance-method"]
      ],
    },
  ],
  // note you must disable the base rule as it can report incorrect errors
  'lines-between-class-members': 'off',
  '@typescript-eslint/lines-between-class-members': 'warn',
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/strict-boolean-expressions.md
  '@typescript-eslint/strict-boolean-expressions': ['off'],
  'no-restricted-syntax': [
    'error',
    {
      'selector': 'TSEnumDeclaration',
      'message': "Don't declare enums"
    }
  ]
}
