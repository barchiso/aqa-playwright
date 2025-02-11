import { test as base } from '@playwright/test';
import GaragePage from '../../pom/pages/GaragePage';
import HomePage from '../../pom/pages/HomePage';
import SignInForm from '../../pom/forms/SignInForm';

type fixturePages = {
	userGaragePages: GaragePage;
};

let homePage: HomePage;
let signInForm: SignInForm;
let garagePage: GaragePage;

export const test = base.extend<fixturePages>({
	userGaragePages: async ({ browser }, use) => {
		const context = await browser.newContext({
			storageState: './test-data/states/userTwoState.json',
		});
		const page = await context.newPage();
		homePage = new HomePage(page);
		signInForm = new SignInForm(page);
		garagePage = new GaragePage(page);
		await garagePage.open();

		await use(garagePage);

		await page.close();
		await context.close();
	},
});
