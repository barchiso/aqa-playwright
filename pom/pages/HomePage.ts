import { Locator, Page } from '@playwright/test';

export default class HomePage {
	readonly page: Page;
	readonly signUpButton: Locator;

	constructor(page: Page) {
		this.page = page;
		this.signUpButton = page.locator('//button[text()="Sign up"]');
	}

	async open() {
		await this.page.goto('/');
	}

	async clickSignUpButton() {
		await this.signUpButton.click();
	}
}
