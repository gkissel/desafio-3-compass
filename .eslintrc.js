/** @type { import('eslint').Linter.Config } */
module.exports = {
  extends: ['@rocketseat/eslint-config/node'],
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
    'react/jsx-filename-extension': 'off',
    'no-useless-constructor': 'off',
  },
  ignorePatterns: ['package.json'],
}
