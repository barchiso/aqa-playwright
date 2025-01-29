
//  Homework #43. POM in Playwright.
//  Rewrite existing user registration tests using Page Objects.

import { test, expect } from '@playwright/test';
import { credentials } from '../test-data/usersData';
import HomePage from '../pom/pages/HomePage';
import GaragePage from '../pom/pages/GaragePage';
import SignUpForm from '../pom/forms/SignUpForm';

test.describe('Sign Up Form', () => {
	const uniqueEmail = credentials.userOne.email;
	const uniquePassword = credentials.userOne.password;

	let homePage: HomePage;
	let signUpForm: SignUpForm;
	let garagePage: GaragePage;

	test.beforeEach(async ({ page }) => {
		// Open the home page and click the "Sign Up" button
		homePage = new HomePage(page);
		signUpForm = new SignUpForm(page);
		garagePage = new GaragePage(page);

		await homePage.open();
		await homePage.clickSignUpButton();
	});

	test('Verify user successful registration.', async () => {
		await signUpForm.signupWithCredentials(
			'Johnny',
			'Bravo',
			uniqueEmail,
			uniquePassword,
			uniquePassword,
		);

		// Verify the success message on the Garage page
		await garagePage.verifySuccessMessage('Registration complete');
	});

	test.describe('Validate "Name" field.', async () => {
		test('Sign up without name', async () => {
			await signUpForm.validateField(
				signUpForm.nameField,
				signUpForm.requiredName,
				'Name required',
			);
		});

		test('Sign up with invalid name', async () => {
			await signUpForm.enterName('Johnny@');
			await signUpForm.validateField(
				signUpForm.nameField,
				signUpForm.invalidName,
				'Name is invalid',
			);
		});

		test('Sign up with short name', async () => {
			await signUpForm.enterName('J');
			await signUpForm.validateField(
				signUpForm.nameField,
				signUpForm.lengthName,
				'Name has to be from 2 to 20 characters long',
			);
		});

		test('Sign up with long name', async () => {
			await signUpForm.enterName('JohnnyJohnnyJohnnyJohnny');
			await signUpForm.validateField(
				signUpForm.nameField,
				signUpForm.lengthName,
				'Name has to be from 2 to 20 characters long',
			);
		});
	});

	test.describe('Validate "Last Name" field.', async () => {
		test('Sign up without last name', async () => {
			await signUpForm.validateField(
				signUpForm.lastNameField,
				signUpForm.requiredLastName,
				'Last name required',
			);
		});

		test('Sign up with invalid last name', async () => {
			await signUpForm.enterLastName('Bravo@');
			await signUpForm.validateField(
				signUpForm.lastNameField,
				signUpForm.invalidLastName,
				'Last name is invalid',
			);
		});

		test('Sign up with short last name', async () => {
			await signUpForm.enterLastName('B');
			await signUpForm.validateField(
				signUpForm.lastNameField,
				signUpForm.lengthLastName,
				'Last name has to be from 2 to 20 characters long',
			);
		});

		test('Sign up with long last name', async () => {
			await signUpForm.enterLastName('BravoBravoBravoBravoB');
			await signUpForm.validateField(
				signUpForm.lastNameField,
				signUpForm.lengthLastName,
				'Last name has to be from 2 to 20 characters long',
			);
		});
	});

	test.describe('Validate "Email" field.', async () => {
		test('Sign up without email', async () => {
			await signUpForm.validateField(
				signUpForm.emailField,
				signUpForm.requiredEmail,
				'Email required',
			);
		});

		test('Sign up with invalid email', async () => {
			await signUpForm.enterEmail('Bravo@');
			await signUpForm.validateField(
				signUpForm.emailField,
				signUpForm.invalidEmail,
				'Email is incorrect',
			);
		});
	});

	test.describe('Validate "Password" field.', async () => {
		test('Sign up without password', async () => {
			await signUpForm.validateField(
				signUpForm.passwordField,
				signUpForm.requiredPassword,
				'Password required',
			);
		});

		test('Sign up with invalid password', async () => {
			await signUpForm.enterPassword('password');
			await signUpForm.validateField(
				signUpForm.passwordField,
				signUpForm.invalidPassword,
				'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter',
			);
		});
	});

	test.describe('Validate "Re-enter password" field.', async () => {
		test('Sign up without re-enter password', async () => {
			await signUpForm.validateField(
				signUpForm.confirmField,
				signUpForm.requiredConfirmPassword,
				'Re-enter password required',
			);
		});

		test('Verify passwords do not match', async () => {
			await signUpForm.enterPassword(uniquePassword);
			await signUpForm.enterConfirmPassword('Password2');
			await signUpForm.validateField(
				signUpForm.confirmField,
				signUpForm.notMatchPasswords,
				'Passwords do not match',
			);
		});
=======
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
