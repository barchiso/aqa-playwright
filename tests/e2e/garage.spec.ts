import { test } from '../../test-data/fixtures/fixtures';

test.describe('Garage Page', () => {
	test.use({ storageState: './test-data/states/userTwoState.json' });

	test(`Add BMW X6`, async ({ userGaragePages }) => {
		await test.step('Add BMW X6 Car to Garage', async () => {
			await userGaragePages.addCarByBrandAndModel('BMW', 'X6', '500');
			await userGaragePages.verifyLastAddedCar('BMW X6');
		});
	});

	test(`Add Audi TT`, async ({ userGaragePages }) => {
		await userGaragePages.addCarByBrandAndModel('Audi', 'TT', '500');
		await userGaragePages.verifyLastAddedCar('Audi TT');
	});

	test(`Add Ford Fiesta`, async ({ userGaragePages }) => {
		await userGaragePages.addCarByBrandAndModel('Ford', 'Fiesta', '500');
		await userGaragePages.verifyLastAddedCar('Ford Fiesta');
	});

	test.afterEach(async ({ userGaragePages }) => {
		await userGaragePages.removeLastAddedCar();
	});
});
