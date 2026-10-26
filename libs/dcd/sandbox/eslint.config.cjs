const baseConfig = require('../../../eslint.config.cjs');
const nx = require('@nx/eslint-plugin');
module.exports = [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'dcd',
          style: 'camelCase'
        }
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'dcd',
          style: 'kebab-case'
        }
      ]
    }
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {}
  },
  {
    files: ['**/*.ts'],
    rules: {
      // Angular 22 migration set ChangeDetectionStrategy.Eager on components here to keep their
      // pre-v22 behaviour; angular-eslint 22 recommended now rejects that opt-out.
      '@angular-eslint/prefer-on-push-component-change-detection': 'off'
    }
  }
];
