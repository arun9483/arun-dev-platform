import js from '@eslint/js';
import tseslint from 'typescript-eslint';

const baseConfig = tseslint.config(js.configs.recommended, ...tseslint.configs.strict, {
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
  },
});

export default [
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**', 'coverage/**', '.turbo/**'],
  },
  ...baseConfig,
];
