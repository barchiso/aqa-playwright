// Task 2
// https://qauto.forstudy.space/api-docs/#/
// Using APIRequestContext, write several API tests to create cars
// /api/cars POST
// Minimum number of tests
// 1 positive scenario
// 2 negative scenarios

import {
	test,
	expect,
	request as playwrightRequest,
	APIRequestContext,
} from '@playwright/test';
import { credentials } from '../../test-data/usersData';
import CarsController from '../../api-controllers/CarsController';
import AuthController from '../../api-controllers/AuthController';

let sid: string;
let carId: number;
let apiContext: APIRequestContext;
let carsController: CarsController;

test.beforeAll(async () => {
	apiContext = await playwrightRequest.newContext({});

	const authController = new AuthController(apiContext);

	sid = await authController.signInAndGetCookie(
		credentials.userTwo.email,
		credentials.userTwo.password,
	);
});

test.beforeEach(async () => {
	carsController = new CarsController(apiContext);
});

test.describe('API Tests for Cars', () => {
	test('Create a new car successfully', async () => {
		const responseBody = await carsController.addCar(1, 2, 5000, sid);

		carId = responseBody.data.id;

		expect(responseBody.status).toBe('ok');
		expect(responseBody.data.brand).toBe('Audi');
		expect(responseBody.data.model).toBe('R8');
		expect(responseBody.data.mileage).toBe(5000);
	});

	test('Fail to create a car without carBrandId', async () => {
		const responseBody = await carsController.addCar(
			undefined as any,
			10,
			5000,
			sid,
		);

		expect(responseBody.status).toBe('error');
		expect(responseBody.message).toBe('Car brand id is required');
	});

	test('Fail to create a car with negative mileage', async () => {
		const responseBody = await carsController.addCar(1, 10, -100, sid);

		expect(responseBody.status).toBe('error');
		expect(responseBody.message).toBe(
			'Mileage has to be from 0 to 999999',
		);
	});

	test('Get all user cars', async () => {
		const responseBody = await carsController.getUserCars(sid);

		expect(responseBody.status).toBe('ok');
		expect(Array.isArray(responseBody.data)).toBeTruthy();
		expect(responseBody.data.length).toBeGreaterThan(1);
	});

	test('Update car mileage', async () => {
		carId;
		const newMileage = 6000;

		const responseBody = await carsController.updateCarMileage(
			carId,
			newMileage,
			sid,
		);

		expect(responseBody.status).toBe('ok');
		expect(responseBody.data.mileage).toBe(newMileage);
	});

	test('Delete the created car', async () => {
		const getCarsResponse = await carsController.getUserCars(sid);
		const lastAddedCarId = getCarsResponse.data[0].id;

		const deleteCarResponse = await carsController.deleteCarById(
			lastAddedCarId,
			sid,
		);
		expect(deleteCarResponse.data.carId).toBe(lastAddedCarId);
	});

	test('Fail to delete a non-existing car', async () => {
		const deleteCarResponse = await carsController.deleteCarById(
			999999,
			sid,
		);
		expect(deleteCarResponse.message).toBe('Car not found');
	});
});
