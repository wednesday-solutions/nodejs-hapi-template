module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {},
  settings: {
    'import/resolver': {
      webpack: {
        config: './webpack/production.config.js',
      },
    },
  },
};
