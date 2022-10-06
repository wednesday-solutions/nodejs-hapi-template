module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {},
  settings: {
    'import/resolver': {
      node: {},
      webpack: {
        config: './webpack/production.config.js',
      },
    },
  },
  overrides: [
    {
      files: '*.test.js',
      rules: {
        'no-promise-executor-return': 'off',
        'global-require': 'off',
        'no-param-reassign': 'off',
        'no-shadow': 'off',
        'no-underscore-dangle': 'off',
        'no-undef': 'off',
        'consistent-return': 'off',
        'no-return-assign': 'off',
      },
    }
  ],
};
