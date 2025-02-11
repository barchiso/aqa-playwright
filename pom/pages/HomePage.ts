import { Locator, Page } from '@playwright/test';

export default class HomePage {
	readonly page: Page;
	readonly signUpButton: Locator;
	readonly signInButton: Locator;

	constructor(page: Page) {
		this.page = page;
		this.signUpButton = page.locator('//button[text()="Sign up"]');
		this.signInButton = page.locator('//button[text()="Sign In"]');
	}

	async open() {
		await this.page.goto('/');
	}

	async clickSignUpButton() {
		await this.signUpButton.click();
	}

	async clickSignInButton() {
		await this.signInButton.click();
	}
}
