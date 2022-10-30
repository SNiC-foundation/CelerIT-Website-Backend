module.exports = {
  env: {
    es2021: true,
    node: true,
    mocha: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  rules: {
    'linebreak-style': ['error', 'windows'],
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'no-unused-expressions': 'off',
    'import/extensions': ['off', 'ignorePackages', {
      js: 'never',
      ts: 'never',
    }],
  },
  settings: {
    'import/extensions': ['.js', '.ts'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
};
