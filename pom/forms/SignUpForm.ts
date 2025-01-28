import { expect, Locator, Page } from '@playwright/test';

export default class SignUpForm {
	readonly page: Page;
	readonly nameField: Locator;
	readonly lastNameField: Locator;
	readonly emailField: Locator;
	readonly passwordField: Locator;
	readonly confirmField: Locator;

	readonly requiredName: Locator;
	readonly invalidName: Locator;
	readonly lengthName: Locator;
	readonly requiredLastName: Locator;
	readonly invalidLastName: Locator;
	readonly lengthLastName: Locator;
	readonly requiredEmail: Locator;
	readonly invalidEmail: Locator;
	readonly requiredPassword: Locator;
	readonly invalidPassword: Locator;
	readonly requiredConfirmPassword: Locator;
	readonly notMatchPasswords: Locator;
	readonly registerButton: Locator;

	constructor(page: Page) {
		this.page = page;

		this.nameField = page.locator('//input[@id="signupName"]');
		this.lastNameField = page.locator('//input[@id="signupLastName"]');
		this.emailField = page.locator('//input[@id="signupEmail"]');
		this.passwordField = page.locator('//input[@id="signupPassword"]');
		this.confirmField = page.locator(
			'//input[@id="signupRepeatPassword"]',
		);
		this.registerButton = page.locator('//button[text()="Register"]');

		this.requiredName = page.locator('//p[text()="Name required"]');
		this.invalidName = page.locator('//p[text()="Name is invalid"]');
		this.lengthName = page.locator(
			'//p[text()="Name has to be from 2 to 20 characters long"]',
		);

		this.requiredLastName = page.locator(
			'//p[text()="Last name required"]',
		);
		this.invalidLastName = page.locator(
			'//p[text()="Last name is invalid"]',
		);
		this.lengthLastName = page.locator(
			'//p[text()="Last name has to be from 2 to 20 characters long"]',
		);

		this.requiredEmail = page.locator('//p[text()="Email required"]');
		this.invalidEmail = page.locator('//p[text()="Email is incorrect"]');

		this.requiredPassword = page.locator(
			'//p[text()="Password required"]',
		);
		this.invalidPassword = page.locator('//div[4]//div[1]//p[1]');

		this.requiredConfirmPassword = page.locator(
			'//p[text()="Re-enter password required"]',
		);
		this.notMatchPasswords = page.locator(
			'//p[text()="Passwords do not match"]',
		);
	}

	async enterName(name: string) {
		await this.nameField.fill(name);
	}

	async enterLastName(lastName: string) {
		await this.lastNameField.fill(lastName);
	}

	async enterEmail(email: string) {
		await this.emailField.fill(email);
	}

	async enterPassword(password: string) {
		await this.passwordField.fill(password);
	}

	async enterConfirmPassword(confirmPassword: string) {
		await this.confirmField.fill(confirmPassword);
	}

	async submitRegistration() {
		await this.registerButton.click();
	}

	async signupWithCredentials(
		name: string,
		lastName: string,
		email: string,
		password: string,
		confirmPassword: string,
	) {
		// Fill out the registration form
		await this.enterName(name);
		await this.enterLastName(lastName);
		await this.enterEmail(email);
		await this.enterPassword(password);
		await this.enterConfirmPassword(confirmPassword);

		// Submit the registration form
		await this.submitRegistration();
	}

	async validateField(
		fieldSelector: Locator,
		errorLocator: Locator,
		errorMessage: string,
	) {
		await fieldSelector.focus();
		await fieldSelector.blur();
		await expect(errorLocator).toBeVisible();
		await expect(errorLocator).toHaveText(errorMessage);
		await this.checkRedBorder(fieldSelector);
	}

	// Function to check the red border
	async checkRedBorder(fieldSelector: Locator) {
		await this.page.waitForTimeout(500); // Delay for CSS effect to apply
		await expect(fieldSelector).toHaveCSS(
			'border-color',
			'rgb(220, 53, 69)',
		);
	}
}
