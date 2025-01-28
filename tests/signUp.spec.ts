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
			await signUpForm.nameField.focus();
			await signUpForm.nameField.blur();
			const errorMessage = await signUpForm.nameErrorMessage();
			expect(errorMessage).toBe('Name required');
		});

		test('Sign up with invalid name', async () => {
			await signUpForm.enterName('Johnny@');
			await signUpForm.nameField.blur();
			const invalidError = await signUpForm.nameErrorMessage();
			expect(invalidError).toBe('Name is invalid');
		});

		test('Sign up with short name', async () => {
			await signUpForm.enterName('J');
			await signUpForm.nameField.blur();
			const lengthError = await signUpForm.nameErrorMessage();
			expect(lengthError).toBe(
				'Name has to be from 2 to 20 characters long',
			);
		});

		test('Sign up with long name', async () => {
			await signUpForm.enterName('JohnnyJohnnyJohnnyJohnny');
			await signUpForm.nameField.blur();
			const lengthError = await signUpForm.nameErrorMessage();
			expect(lengthError).toBe(
				'Name has to be from 2 to 20 characters long',
			);
		});
	});

	test.describe('Validate "Last Name" field.', async () => {
		test('Sign up without last name', async () => {
			await signUpForm.lastNameField.focus();
			await signUpForm.lastNameField.blur();
			const errorMessage = await signUpForm.lastNameErrorMessage();
			expect(errorMessage).toBe('Last name required');
		});

		test('Sign up with invalid last name', async () => {
			await signUpForm.enterLastName('Bravo@');
			await signUpForm.lastNameField.blur();
			const invalidError = await signUpForm.lastNameErrorMessage();
			expect(invalidError).toBe('Last name is invalid');
		});

		test('Sign up with short last name', async () => {
			await signUpForm.enterLastName('B');
			await signUpForm.lastNameField.blur();
			const lengthError = await signUpForm.lastNameErrorMessage();
			expect(lengthError).toBe(
				'Last name has to be from 2 to 20 characters long',
			);
		});

		test('Sign up with long last name', async () => {
			await signUpForm.enterLastName('BravoBravoBravoBravoB');
			await signUpForm.lastNameField.blur();
			const lengthError = await signUpForm.lastNameErrorMessage();
			expect(lengthError).toBe(
				'Last name has to be from 2 to 20 characters long',
			);
		});
	});

	test.describe('Validate "Email" field.', async () => {
		test('Sign up without email', async () => {
			await signUpForm.emailField.focus();
			await signUpForm.emailField.blur();
			const errorMessage = await signUpForm.emailErrorMessage();
			expect(errorMessage).toBe('Email required');
		});

		test('Sign up with invalid email', async () => {
			await signUpForm.enterEmail('Bravo@');
			await signUpForm.emailField.blur();
			const invalidError = await signUpForm.emailErrorMessage();
			expect(invalidError).toBe('Email is incorrect');
		});
	});

	test.describe('Validate "Password" field.', async () => {
		test('Sign up without password', async () => {
			await signUpForm.passwordField.focus();
			await signUpForm.passwordField.blur();
			const errorMessage = await signUpForm.passwordErrorMessage();
			expect(errorMessage).toBe('Password required');
		});

		test('Sign up with invalid password', async () => {
			await signUpForm.enterPassword('password');
			await signUpForm.passwordField.blur();
			const invalidError = await signUpForm.passwordErrorMessage();
			expect(invalidError).toBe(
				'Password has to be from 8 to 15 characters long ' +
					'and contain at least one integer, one capital, ' +
					'and one small letter',
			);
		});
	});

	test.describe('Validate "Re-enter password" field.', async () => {
		test('Sign up without re-enter password', async () => {
			await signUpForm.confirmField.focus();
			await signUpForm.confirmField.blur();
			const errorMessage = await signUpForm.confirmErrorMessage();
			expect(errorMessage).toBe('Re-enter password required');
		});

		test('Verify passwords do not match', async () => {
			await signUpForm.enterPassword(uniquePassword);
			await signUpForm.enterConfirmPassword('Password2');
			await signUpForm.confirmField.blur();
			const invalidError = await signUpForm.confirmErrorMessage();
			expect(invalidError).toBe('Passwords do not match');
		});
	});
});
