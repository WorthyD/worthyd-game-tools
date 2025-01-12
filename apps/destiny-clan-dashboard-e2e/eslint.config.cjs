const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const baseConfig = require('../../eslint.config.cjs');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

module.exports = [
  {
    ignores: ['**/dist']
  },
  ...baseConfig,
  ...compat.extends('plugin:cypress/recommended'),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {}
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    // Override or add rules here
    rules: {}
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {}
  },
  {
    files: ['**/*.cy.{ts,js,tsx,jsx}', 'src/**/*.{ts,js,tsx,jsx}'],
    // Override or add rules here
    rules: {}
  }
];
