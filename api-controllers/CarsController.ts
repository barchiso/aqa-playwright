import { APIRequestContext } from '@playwright/test';

export default class CarsController {
	private request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
	}

	async getUserCars(cookies: string) {
		const response = await this.request.get('api/cars', {
			headers: {
				Cookie: `sid=${cookies}`,
			},
		});

		return await response.json();
	}

	async deleteCarById(id: number, cookies: string) {
		const response = await this.request.delete(`api/cars/${id}`, {
			headers: {
				Cookie: `sid=${cookies}`,
			},
		});
		return await response.json();
	}

	async addCar(
		brandId: number,
		modelId: number,
		mileage: number,
		cookies: string,
	) {
		const response = await this.request.post(`api/cars/`, {
			data: {
				carBrandId: brandId,
				carModelId: modelId,
				mileage: mileage,
			},
			headers: {
				Cookie: `sid=${cookies}`,
			},
		});
		return await response.json();
	}

	async updateCarMileage(carId: number, mileage: number, cookies: string) {
		const response = await this.request.put(`api/cars/${carId}`, {
			data: {
				mileage: mileage,
			},
			headers: {
				Cookie: `sid=${cookies}`,
			},
		});
		return await response.json();
	}
}
