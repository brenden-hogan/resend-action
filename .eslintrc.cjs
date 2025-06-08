module.exports = {
  env: {
    node: true,
    browser: true,
    es2024: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'semi': ['error', 'never'],
    'quotes': ['error', 'single', { allowTemplateLiterals: true }],
    '@typescript-eslint/triple-slash-reference': 'off',
  },
  overrides: [],
}
