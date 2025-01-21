import globals from 'globals';
import pluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import pluginPlaywright from 'eslint-plugin-playwright';
import pluginPrettier from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config} */
export default {
	languageOptions: {
		parser: parserTs,
		parserOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
		},
		globals: {
			...globals.browser,
			process: 'readonly',
		},
	},
	plugins: {
		'@typescript-eslint': pluginTs,
		playwright: pluginPlaywright,
		prettier: pluginPrettier,
	},
	rules: {
		// @typescript-eslint/recommended rules
		'@typescript-eslint/explicit-module-boundary-types': 'warn',
		'@typescript-eslint/explicit-function-return-type': 'warn',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-inferrable-types': 'off',
		'@typescript-eslint/no-empty-function': 'warn',
		'@typescript-eslint/no-unused-vars': 'warn',

		// Playwright recommended rules
		'playwright/expect-expect': 'warn',
		'playwright/no-wait-for-timeout': 'error',

		// Prettier plugin rule
		'prettier/prettier': 'error',

		// ESLint recommended rules (manually added)
		'no-console': 'warn',
		'no-debugger': 'warn',
		eqeqeq: 'error',
		curly: ['error', 'all'],
		'no-trailing-spaces': 'error',
		semi: ['error', 'always'],
		quotes: ['error', 'single'],
		'consistent-return': 'error',
	},
};
