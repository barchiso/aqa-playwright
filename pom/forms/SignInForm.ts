import { expect, Locator, Page } from '@playwright/test';

export default class SignInForm {
	readonly page: Page;
	readonly emailField: Locator;
	readonly passwordField: Locator;
	readonly errorMessage: Locator;
	readonly loginButton: Locator;
	readonly wrongDataMessage: Locator;

	constructor(page: Page) {
		this.page = page;
		this.emailField = page.locator('//input[@id="signinEmail"]');
		this.passwordField = page.locator('//input[@id="signinPassword"]');
		this.errorMessage = page.locator(
			'//div[@class="invalid-feedback"]//p',
		);
		this.loginButton = page.locator(
			'//div[@class="modal-content"]//button[contains(@class, "btn-primary")]',
		);
		this.wrongDataMessage = page.locator(
			'//p[contains(@class, "alert-danger")]',
		);
	}

	async triggerErrorOnField(fieldName: string) {
		const field =
			fieldName === 'email' ? this.emailField : this.passwordField;
		await field.focus();
		await field.blur();
	}

	async enterEmail(email: string) {
		await this.emailField.fill(email);
	}

	async enterPassword(password: string) {
		await this.passwordField.fill(password);
	}

	async verifyErrorMessageByText(text: string) {
		await expect(this.errorMessage).toHaveText(text);
	}

	async clickLoginButton() {
		await this.loginButton.click();
	}

	async verifyWrongDataMessage() {
		await expect(this.wrongDataMessage).toBeVisible();
	}

	async loginWithCredentials(email: string, password: string) {
		await this.enterEmail(email);
		await this.enterPassword(password);
		await this.clickLoginButton();
	}
}
