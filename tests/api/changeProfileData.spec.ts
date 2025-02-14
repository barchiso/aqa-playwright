// Task 1
// On the user profile page, replace the response body for the specified request
// Then check whether the data displayed on the page matches the data you replaced

import { test, expect } from '@playwright/test';
import HomePage from '../../pom/pages/HomePage';
import SignInForm from '../../pom/forms/SignInForm';
import { credentials } from '../../test-data/usersData';

const BASE_URL = 'https://qauto.forstudy.space';
const PROFILE_URL = `${BASE_URL}/panel/profile`;
const USER_EMAIL = credentials.userTwo.email;
const USER_PASSWORD = credentials.userTwo.password;

test.describe('Change profile data', () => {
	let homePage: HomePage;
	let signInForm: SignInForm;

	test('Intercept and change user name to Polar Bear', async ({ page }) => {
		homePage = new HomePage(page);
		signInForm = new SignInForm(page);

		await homePage.open();
		await homePage.clickSignInButton();

		const fakeBody = {
			status: 'ok',
			data: {
				userId: 182661,
				photoFilename: 'default-user.png',
				name: 'Polar',
				lastName: 'Bear',
			},
		};
		await page.route('**/api/users/profile', async (route) =>
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(fakeBody),
			}),
		);

		await signInForm.loginWithCredentials(USER_EMAIL, USER_PASSWORD);

		await page.locator("//button[@id='userNavDropdown']").click();
		await page.locator("//a[text()='Profile']").click();
		await expect(page).toHaveURL(PROFILE_URL);

		await expect(
			page.locator("//p[@class='profile_name display-4']"),
		).toHaveText('Polar Bear');
	});
});
