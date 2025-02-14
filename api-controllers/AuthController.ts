import { APIRequestContext } from '@playwright/test';

export default class AuthController {
	private request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
	}

	async signInAndGetCookie(email: string, password: string) {
		let sidValueGlobal: string = '';
		const response = await this.request.post('/api/auth/signin', {
			data: {
				email,
				password,
			},
		});

		const sidCookie = await response.headers()['set-cookie'];
		const sidValue = sidCookie.split(';')[0].split('=')[1];
		sidValueGlobal = sidValue;

		return sidValueGlobal;
	}
}
