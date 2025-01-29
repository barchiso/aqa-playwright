//  Homework #43. POM in Playwright.
//  Rewrite existing user registration tests using Page Objects.

import { test } from '@playwright/test';
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
	});
});
