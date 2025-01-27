//  Homework #23. Playwright locators, actions and assertions.
// There is a site https://qauto.forstudy.space/
// There are requirements for the new user registration form.
// Write tests according to the available requirements.

import { test, expect, Page } from '@playwright/test';
import { credentials } from '../test-data/usersData';

test.describe('Sign Up Form.', () => {
	const uniqueEmail = credentials.userOne.email;
	const uniquePassword = credentials.userOne.password;

	const fieldLocators = {
		name: '//input[@id="signupName"]',
		last_name: '//input[@id="signupLastName"]',
		email: '//input[@id="signupEmail"]',
		password: '//input[@id="signupPassword"]',
		confirm: '//input[@id="signupRepeatPassword"]',
	};

	const errorLocators = {
		requiredName: '//p[text()="Name required"]',
		requiredLastName: '//p[text()="Last name required"]',
		requiredEmail: '//p[text()="Email required"]',
		invalidEmail: '//p[text()="Email is incorrect"]',
		requiredPassword: '//p[text()="Password required"]',
		invalidPassword: '//div[4]//div[1]//p[1]',
		requiredConfirmPassword: '//p[text()="Re-enter password required"]',
		notMatchPasswords: '//p[text()="Passwords do not match"]',
	};

	const registerButton = '//button[text()="Register"]';
	const successMessage = '//p[text()="Registration complete"]';
	const signUpButton = '//button[text()="Sign up"]';

	// Function to check the red border
	const checkRedBorder = async (page: Page, fieldSelector: string) => {
		const element = await page.locator(fieldSelector);
		const borderColor = await element.evaluate(
			(el) => getComputedStyle(el).borderColor,
		);
		await expect(borderColor).toContain('rgb(220, 53, 69)');
	};

	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		const signUpButtonLocator = page.locator(signUpButton);
		await signUpButtonLocator.waitFor({ state: 'visible' });
		await signUpButtonLocator.click();
	});

	test('Validate "Name" field.', async ({ page }) => {
		await page.locator(fieldLocators.name).focus();
		await page.locator(fieldLocators.name).blur();
		await expect(page.locator(errorLocators.requiredName)).toBeVisible();
		await expect(page.locator(errorLocators.requiredName)).toHaveText(
			'Name required',
		);
		await checkRedBorder(page, fieldLocators.name);

		// Invalid length validation
		await page.locator(fieldLocators.name).fill('A');
		await page.locator(fieldLocators.name).blur();
		await expect(
			page.locator(
				'//p[text()="Name has to be from 2 to 20 characters long"]',
			),
		).toBeVisible();
		await checkRedBorder(page, fieldLocators.name);

		await page
			.locator(fieldLocators.name)
			.fill('JohnnyJohnnyJohnnyJohnny');
		await page.locator(fieldLocators.name).blur();
		await expect(
			page.locator(
				'//p[text()="Name has to be from 2 to 20 characters long"]',
			),
		).toBeVisible();
		await checkRedBorder(page, fieldLocators.name);

		// Invalid characters validation
		await page.locator(fieldLocators.name).fill('Johnny@');
		await page.locator(fieldLocators.name).blur();
		await expect(
			page.locator('//p[text()="Name is invalid"]'),
		).toBeVisible();
		await checkRedBorder(page, fieldLocators.name);
	});

	test('Validate "Last Name" field.', async ({ page }) => {
		await page.locator(fieldLocators.last_name).focus();
		await page.locator(fieldLocators.last_name).blur();
		await expect(
			page.locator(errorLocators.requiredLastName),
		).toBeVisible();
		await expect(page.locator(errorLocators.requiredLastName)).toHaveText(
			'Last name required',
		);
		await checkRedBorder(page, fieldLocators.last_name);

		// Invalid length validation
		await page.locator(fieldLocators.last_name).fill('A');
		await page.locator(fieldLocators.last_name).blur();
		await expect(
			page.locator(
				'//p[text()="Last name has to be from 2 to 20 characters long"]',
			),
		).toBeVisible();
		await checkRedBorder(page, fieldLocators.last_name);

		await page
			.locator(fieldLocators.last_name)
			.fill('BravoBravoBravoBravoBravo');
		await page.locator(fieldLocators.last_name).blur();
		await expect(
			page.locator(
				'//p[text()="Last name has to be from 2 to 20 characters long"]',
			),
		).toBeVisible();
		await checkRedBorder(page, fieldLocators.last_name);

		// Invalid characters validation
		await page.locator(fieldLocators.last_name).fill('Bravo@');
		await page.locator(fieldLocators.last_name).blur();
		await expect(
			page.locator('//p[text()="Last name is invalid"]'),
		).toBeVisible();
		await checkRedBorder(page, fieldLocators.last_name);
	});

	test('Validate "Email" field.', async ({ page }) => {
		await page.locator(fieldLocators.email).focus();
		await page.locator(fieldLocators.email).blur();
		await expect(page.locator(errorLocators.requiredEmail)).toBeVisible();
		await expect(page.locator(errorLocators.requiredEmail)).toHaveText(
			'Email required',
		);
		await checkRedBorder(page, fieldLocators.email);

		// Invalid characters validation
		await page.locator(fieldLocators.email).fill('johnny.bravo@');
		await page.locator(fieldLocators.email).blur();
		await expect(page.locator(errorLocators.invalidEmail)).toBeVisible();
		await checkRedBorder(page, fieldLocators.email);
	});

	test('Validate "Password" field.', async ({ page }) => {
		await page.locator(fieldLocators.password).focus();
		await page.locator(fieldLocators.password).blur();
		await expect(
			page.locator(errorLocators.requiredPassword),
		).toBeVisible();
		await expect(page.locator(errorLocators.requiredPassword)).toHaveText(
			'Password required',
		);
		await checkRedBorder(page, fieldLocators.password);

		// Invalid password length validation
		await page.locator(fieldLocators.password).fill('short');
		await page.locator(fieldLocators.password).blur();
		await expect(
			page.locator(
				'//p[contains(text(), "Password has to be from 8 to 15 characters")]',
			),
		).toBeVisible();
		await checkRedBorder(page, fieldLocators.password);

		// Invalid password format
		await page.locator(fieldLocators.password).fill('NoDigits');
		await page.locator(fieldLocators.password).blur();
		await expect(
			page.locator(
				'//p[contains(text(), "Password has to be from 8 to 15 characters")]',
			),
		).toBeVisible();
		await checkRedBorder(page, fieldLocators.password);
	});

	test('Validate "Re-enter Password" field.', async ({ page }) => {
		await page.locator(fieldLocators.confirm).focus();
		await page.locator(fieldLocators.confirm).blur();
		await expect(
			page.locator(errorLocators.requiredConfirmPassword),
		).toBeVisible();
		await expect(
			page.locator(errorLocators.requiredConfirmPassword),
		).toHaveText('Re-enter password required');
		await checkRedBorder(page, fieldLocators.confirm);

		await page.locator(fieldLocators.password).fill(uniquePassword);
		await page.locator(fieldLocators.confirm).fill('Password1!');
		await page.locator(fieldLocators.confirm).blur();
		await expect(
			page.locator(errorLocators.notMatchPasswords),
		).toBeVisible();
		await checkRedBorder(page, fieldLocators.confirm);
	});

	test('Verify user successful registration.', async ({ page }) => {
		await page.locator(fieldLocators.name).fill('John');
		await page.locator(fieldLocators.last_name).fill('Doe');
		await page.locator(fieldLocators.email).fill(uniqueEmail);
		await page.locator(fieldLocators.password).fill(uniquePassword);
		await page.locator(fieldLocators.confirm).fill(uniquePassword);
		await page.locator(registerButton).click();
		await expect(page.locator(successMessage)).toBeVisible();
	});
});
