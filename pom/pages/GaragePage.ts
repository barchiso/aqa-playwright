import { expect, Locator, Page } from '@playwright/test';

export default class GaragePage {
	readonly page: Page;
	readonly successMessage: Locator;

	constructor(page: Page) {
		this.page = page;
		this.successMessage = page.locator(
			'//p[text()="Registration complete"]',
		);
	}

	async open() {
		await this.page.goto('/panel/garage');
	}

	async verifySuccessMessage(text: string) {
		await expect(this.successMessage).toBeVisible();
		await expect(this.successMessage).toHaveText(text);
	}
}
