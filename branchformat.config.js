const currentSubPackage = process.cwd().split('/').pop()

module.exports = {
  config: [
    {
      name: 'type',
      type: 'list',
      optional: false,
      default: 'feature',
      message: 'Select branch type（default is feature）：',
      prefix: '',
      options: ['feature', 'bugfix', 'hotfix', 'release'],
      regExp: '(feature|bugfix|hotfix|release)',
    },
  ],
  skip: ['^master$', '^dev$'],
}
