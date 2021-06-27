module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  env: {
    browser: true
  },
  rules: {
    quotes: ['error', 'single'],
    'max-len': ['error', 120],
    'eol-last': ['error', 'always'],
    'semi': ['error', 'always'],
    'no-trailing-spaces': ['error'],
    'arrow-spacing': ['error', { 'before': true, 'after': true }],
    'no-multi-spaces': ['error'],
    indent: 'off',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-explicit-any': ['error'],
  }
};


