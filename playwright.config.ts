import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve('.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './tests',
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: [['allure-playwright'], ['html', { open: 'never' }], ['list']],
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */

		// Use variables from .env
		baseURL: process.env.BASE_URL,

		httpCredentials: {
			username: process.env.AUTH_USERNAME
				? process.env.AUTH_USERNAME
				: '',
			password: process.env.AUTH_PASSWORD
				? process.env.AUTH_PASSWORD
				: '',
		},

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		headless: true,
		trace: 'on-first-retry',
		// trace: 'retain-on-failure',
		video: 'retain-on-failure',
		screenshot: 'on',
	},

	/* Configure projects for major browsers */
	projects: [
		// Updated Setup projects to catch all spec files inside the setup folder
		{
			name: 'setup-chromium',
			use: { ...devices['Desktop Chrome'] },
			testMatch: '*setup/*.ts',
		},
		{
			name: 'setup-webkit',
			use: { ...devices['Desktop Safari'] },
			testMatch: '*setup/*.ts',
		},

		// E2E (Garage) tests remain as before
		{
			name: 'e2e-chromium',
			use: { ...devices['Desktop Chrome'] },
			testMatch: '*e2e/*.ts',
			dependencies: ['setup-chromium'],
		},
		{
			name: 'e2e-webkit',
			use: { ...devices['Desktop Safari'] },
			testMatch: '*e2e/*.ts',
			dependencies: ['setup-webkit'],
		},
		// API tests remain as before
		{
			name: 'api-tests',
			use: { ...devices['Desktop Chrome'] },
			testMatch: '*api/*.ts',
		},
		// Process tests remain as before
		{
			name: 'process-chromium',
			use: { ...devices['Desktop Chrome'] },
			testMatch: '*process/*.ts',
		},
		{
			name: 'process-webkit',
			use: { ...devices['Desktop Safari'] },
			testMatch: '*process/*.ts',
		},

		// {
		// 	name: 'chromium',
		// 	use: { ...devices['Desktop Chrome'] },
		// },
		// {
		// 	name: 'webkit',
		// 	use: { ...devices['Desktop Safari'] },
		// },
		// {
		// 	name: 'firefox',
		// 	use: { ...devices['Desktop Firefox'] },
		// },

		/* Test against mobile viewports. */
		// {
		//   name: 'Mobile Chrome',
		//   use: { ...devices['Pixel 5'] },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: { ...devices['iPhone 12'] },
		// },

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: { ...devices['Desktop Edge'], channel: 'msedge' },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
		// },
	],

	/* Run your local dev server before starting the tests */
	// webServer: {
	//   command: 'npm run start',
	//   url: 'http://127.0.0.1:3000',
	//   reuseExistingServer: !process.env.CI,
	// },
});
