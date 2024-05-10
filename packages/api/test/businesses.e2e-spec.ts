import chai, { expect } from 'chai';

import { HttpStatus, ValidationPipe } from '@nestjs/common';
import Business from '../src/core/business/entities/business.entity';
import BusinessFactory from '../src/core/business/business.factory';
import chaiSubset from 'chai-subset';
import { AuthModule } from '../src/core/auth/auth.module';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import TestUtils, { getHttpClient } from './utils';
import { BusinessApiModule } from '../src/api/business-api/business-api.module';
import { AuthApiModule } from '../src/api/auth-api/auth-api.module';
import { BusinessModule } from '../src/core/business/business.module';
import { UserApiModule } from '../src/api/user-api/user-api.module';
import { UserModule } from '../src/core/user/user.module';
import { UserService } from '../src/core/user/user.service';
import { BusinessService } from '../src/core/business/business.service';

chai.use(chaiSubset);

const createdBusinesses: Business[] = [];

describe('BusinessController (e2e)', function () {
	this.timeout(500000);

	let app: NestFastifyApplication;
	let businesseservice: BusinessService;
	let userService: UserService;
	let users;
	let businesses: Business[];

	this.beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [UserApiModule, BusinessApiModule, AuthModule, AuthApiModule, BusinessModule, UserModule]
		}).compile();
		app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
		app.useGlobalPipes(new ValidationPipe());

		await app.init();
		await app.getHttpAdapter().getInstance().ready();
		userService = app.get<UserService>(UserService);
		businesseservice = app.get<BusinessService>(BusinessService);
		users = await TestUtils.createBasicAndAdminUsers(userService);
		const newBusinesses = await TestUtils.createBusinesses(businesseservice);
		businesses = [newBusinesses.first, newBusinesses.second];
	});

	describe('As basic user', () => {
		it('Should not be able to retrieve business list without being logged (GET /businesses)', async () => {
			const httpClient = await getHttpClient(users.basic, app);
			const response = await httpClient.withoutToken().get('/businesses');
			expect(response.statusCode).to.be.eq(HttpStatus.UNAUTHORIZED);
		});

		it('Should not be able to retrieve business list (GET /businesses)', async () => {
			const httpClient = await getHttpClient(users.basic, app);
			const response = await httpClient.get('/businesses');
			expect(response.statusCode).to.be.eq(HttpStatus.FORBIDDEN);
		});

		it('Should not be able to update a business (UPDATE /businesses/:id)', async () => {
			const httpClient = await getHttpClient(users.basic, app);
			const newBusinessData = BusinessFactory.buildOne();
			const response = await httpClient.patch(`/businesses/another_id`, newBusinessData);
			expect(response.statusCode).to.be.eq(HttpStatus.FORBIDDEN);
		});

		it('Should not be able to delete another business (DELETE /businesses/:id)', async () => {
			const httpClient = await getHttpClient(users.basic, app);
			const newBusinessData = BusinessFactory.buildOne();
			const response = await httpClient.delete(`/businesses/another_id`, newBusinessData);
			expect(response.statusCode).to.be.eq(HttpStatus.FORBIDDEN);
		});

		it('Should not be able to create a business (POST /businesses)', async () => {
			const httpClient = await getHttpClient(users.basic, app);
			const business = BusinessFactory.buildOne();
			const response = await httpClient.post('/businesses', business);
			expect(response.statusCode).to.be.eq(HttpStatus.FORBIDDEN);
		});
	});

	describe('As admin user', () => {
		it('Should be able to retrieve business list (/businesses)', async () => {
			const httpClient = await getHttpClient(users.admin, app);
			const response = await httpClient.get('/businesses');
			expect(response.statusCode).to.be.eq(HttpStatus.OK);
			expect(response.json<Business[]>()).to.be.instanceOf(Array);
			expect(response.json<Business[]>().length).to.be.gt(0);
		});

		it('Should be able to create a business (POST /businesses)', async () => {
			const httpClient = await getHttpClient(users.admin, app);
			const business = BusinessFactory.buildOne();
			const response = await httpClient.post('/businesses', business);
			expect(response.statusCode).to.be.eq(HttpStatus.CREATED);
			createdBusinesses.push(response.json<Business>());
		});

		it('Should be able to update a business (PATCH /businesses/:id)', async () => {
			const httpClient = await getHttpClient(users.admin, app);
			// Create a business
			const business = BusinessFactory.buildOne();
			let response = await httpClient.post('/businesses', { ...business });
			expect(response.statusCode).to.be.eq(HttpStatus.CREATED);
			createdBusinesses.push(response.json<Business>());

			// Update it
			const newBusinessData = BusinessFactory.buildOne();
			response = await httpClient.patch(
				`/businesses/${createdBusinesses[createdBusinesses.length - 1].id}`,
				newBusinessData
			);
			expect(response.statusCode).to.be.eq(HttpStatus.OK);
			expect(response.json<Business>().name).to.be.eq(newBusinessData.name);
		});

		it('Should be able to delete a business (DELETE /businesses/:id)', async () => {
			const httpClient = await getHttpClient(users.admin, app);
			// Create a business
			const business = BusinessFactory.buildOne();
			let response = await httpClient.post('/businesses', { ...business });
			expect(response.statusCode).to.be.eq(HttpStatus.CREATED);
			createdBusinesses.push(response.json<Business>());

			// Delete it
			response = await httpClient.delete(`/businesses/${createdBusinesses[createdBusinesses.length - 1].id}`);
			expect(response.statusCode).to.be.eq(HttpStatus.OK);

			response = await httpClient.get(`/businesses/${createdBusinesses[createdBusinesses.length - 1].id}`);
			expect(response.statusCode).to.be.eq(HttpStatus.NOT_FOUND);
			createdBusinesses.pop();
		});
	});

	this.afterEach(async () => {
		const httpClient = await getHttpClient(users.admin, app);
		for (const business of createdBusinesses) {
			await httpClient.delete(`/businesses/${business.id}`);
		}
		await httpClient.delete(`/users/${users.basic.id}`);
		await httpClient.delete(`/users/${users.admin.id}`);
	});
});
