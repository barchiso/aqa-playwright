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
		lastName: '//input[@id="signupLastName"]',
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

	/// Function to check the red border
	const checkRedBorder = async (page: Page, fieldSelector: string) => {
		await page.waitForTimeout(1000); // Delay for CSS effect to apply
		await expect(page.locator(fieldSelector)).toHaveCSS(
			'border-color',
			'rgb(220, 53, 69)',
		);
	};

	// General function for validating fields
	const validateField = async (
		page: Page,
		fieldSelector: string,
		errorLocator: string,
		errorMessage: string,
	) => {
		await page.locator(fieldSelector).focus();
		await page.locator(fieldSelector).blur();
		await expect(page.locator(errorLocator)).toBeVisible();
		await expect(page.locator(errorLocator)).toHaveText(errorMessage);
		await checkRedBorder(page, fieldSelector);
	};

	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		const signUpButtonLocator = page.locator(signUpButton);
		await signUpButtonLocator.waitFor({
			state: 'visible',
			timeout: 60000,
		});
		await signUpButtonLocator.click();
	});

	test('Validate "Name" field.', async ({ page }) => {
		// Validate empty field
		await validateField(
			page,
			fieldLocators.name,
			errorLocators.requiredName,
			'Name required',
		);

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
		// Validate empty field
		await validateField(
			page,
			fieldLocators.lastName,
			errorLocators.requiredLastName,
			'Last name required',
		);

		// Invalid length validation
		await page.locator(fieldLocators.lastName).fill('A');
		await page.locator(fieldLocators.lastName).blur();
		await expect(
			page.locator(
				'//p[text()="Last name has to be from 2 to 20 characters long"]',
			),
		).toBeVisible();
		await checkRedBorder(page, fieldLocators.lastName);

		await page
			.locator(fieldLocators.lastName)
			.fill('BravoBravoBravoBravoBravo');
		await page.locator(fieldLocators.lastName).blur();
		await expect(
			page.locator(
				'//p[text()="Last name has to be from 2 to 20 characters long"]',
			),
		).toBeVisible();
		await checkRedBorder(page, fieldLocators.lastName);

		// Invalid characters validation
		await page.locator(fieldLocators.lastName).fill('Bravo@');
		await page.locator(fieldLocators.lastName).blur();
		await expect(
			page.locator('//p[text()="Last name is invalid"]'),
		).toBeVisible();
		await checkRedBorder(page, fieldLocators.lastName);
	});

	test('Validate "Email" field.', async ({ page }) => {
		// Validate empty field
		await validateField(
			page,
			fieldLocators.email,
			errorLocators.requiredEmail,
			'Email required',
		);

		// Invalid characters validation
		await page.locator(fieldLocators.email).fill('johnny.bravo@');
		await page.locator(fieldLocators.email).blur();
		await expect(page.locator(errorLocators.invalidEmail)).toBeVisible();
		await checkRedBorder(page, fieldLocators.email);
	});

	test('Validate "Password" field.', async ({ page }) => {
		// Validate empty field
		await validateField(
			page,
			fieldLocators.password,
			errorLocators.requiredPassword,
			'Password required',
		);

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
		// Validate empty field
		await validateField(
			page,
			fieldLocators.confirm,
			errorLocators.requiredConfirmPassword,
			'Re-enter password required',
		);

		// Password mismatch validation
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
		await page.locator(fieldLocators.lastName).fill('Doe');
		await page.locator(fieldLocators.email).fill(uniqueEmail);
		await page.locator(fieldLocators.password).fill(uniquePassword);
		await page.locator(fieldLocators.confirm).fill(uniquePassword);
		await page.locator(registerButton).click();

		// Verify success message
		await expect(page.locator(successMessage)).toBeVisible();
	});
});
