import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      playwright,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    rules: {
      // === Code Style ===
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'indent': ['error', 2],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],

      // === Line Spacing ===
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      'padded-blocks': ['error', 'never'],

      // === Character Spacing ===
      'comma-spacing': ['error', { before: false, after: true }],
      'space-infix-ops': 'error',
      'keyword-spacing': ['error', { before: true, after: true }],
      'object-curly-spacing': ['error', 'always'],
      'space-in-parens': ['error', 'never'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-blocks': 'error',
      'space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      }],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'arrow-spacing': ['error', { before: true, after: true }],
      'func-call-spacing': ['error', 'never'],
      'no-multi-spaces': 'error',
      'no-whitespace-before-property': 'error',

      // === TypeScript ===
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'no-empty-pattern': 'off',
      'no-useless-escape': 'off',
      'no-empty': 'off',

      // === Playwright ===
      'playwright/valid-expect': 'error',
      'playwright/no-skipped-test': 'warn',
    },
  },
  {
    ignores: [
      'node_modules/',
      'build/',
      'allure-*/',
      'test-results/',
    ],
  }
);
