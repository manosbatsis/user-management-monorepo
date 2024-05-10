import chai, { expect } from 'chai';

import { HttpStatus, ValidationPipe } from '@nestjs/common';
import Employee from '../src/core/employee/entities/employee.entity';
import EmployeeFactory from '../src/core/employee/employee.factory';
import chaiSubset from 'chai-subset';
import { AuthModule } from '../src/core/auth/auth.module';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import TestUtils, { getHttpClient } from './utils';
import { EmployeeApiModule } from '../src/api/employee-api/employee-api.module';
import { AuthApiModule } from '../src/api/auth-api/auth-api.module';
import { EmployeeModule } from '../src/core/employee/employee.module';
import { UserApiModule } from '../src/api/user-api/user-api.module';
import { UserModule } from '../src/core/user/user.module';
import { UserService } from '../src/core/user/user.service';
import { EmployeeService } from '../src/core/employee/employee.service';
import { BusinessService } from '../src/core/business/business.service';
import { BusinessApiModule } from '../src/api/business-api/business-api.module';
import { BusinessModule } from '../src/core/business/business.module';
import UserFactory from '../src/core/user/user.factory';
import BusinessFactory from '../src/core/business/business.factory';
import { faker } from '@faker-js/faker';

chai.use(chaiSubset);

const createdEmployees: Employee[] = [];

describe('EmployeeController (e2e)', function () {
	this.timeout(500000);

	let app: NestFastifyApplication;
	let employeeService: EmployeeService;
	let userService: UserService;
	let businessService: BusinessService;
	let users;
	let employees: Employee[];

	this.beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				AuthApiModule,
				AuthModule,
				BusinessApiModule,
				BusinessModule,
				EmployeeApiModule,
				EmployeeModule,
				UserApiModule,
				UserModule
			]
		}).compile();
		app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
		app.useGlobalPipes(new ValidationPipe());

		await app.init();
		await app.getHttpAdapter().getInstance().ready();

		userService = app.get<UserService>(UserService);
		employeeService = app.get<EmployeeService>(EmployeeService);
		businessService = app.get<BusinessService>(BusinessService);

		users = await TestUtils.createBasicAndAdminUsers(userService);
		const newEmployee = await TestUtils.createEmployee(userService, businessService, employeeService);
		employees = [newEmployee];
	});

	describe('As basic user', () => {
		it('Should not be able to retrieve employee list without being logged (GET /employees)', async () => {
			const httpClient = await getHttpClient(users.basic, app);
			const response = await httpClient.withoutToken().get('/employees');
			expect(response.statusCode).to.be.eq(HttpStatus.UNAUTHORIZED);
		});

		it('Should not be able to retrieve employee list (GET /employees)', async () => {
			const httpClient = await getHttpClient(users.basic, app);
			const response = await httpClient.get('/employees');
			expect(response.statusCode).to.be.eq(HttpStatus.FORBIDDEN);
		});

		it('Should not be able to update a employee (UPDATE /employees/:id)', async () => {
			const httpClient = await getHttpClient(users.basic, app);
			const response = await httpClient.patch(`/employees/${employees[0].id}`, { telNumber: faker.phone.number() });
			expect(response.statusCode).to.be.eq(HttpStatus.FORBIDDEN);
		});

		it('Should not be able to delete another employee (DELETE /employees/:id)', async () => {
			const httpClient = await getHttpClient(users.basic, app);
			const response = await httpClient.delete(`/employees/${employees[0].id}`);
			expect(response.statusCode).to.be.eq(HttpStatus.FORBIDDEN);
		});

		it('Should not be able to create a employee (POST /employees)', async () => {
			const httpClient = await getHttpClient(users.basic, app);
			const user = await userService.create(UserFactory.buildOne());
			const business = await businessService.create(BusinessFactory.buildOne());
			const newEmployeeData = EmployeeFactory.buildOne(user, business);
			const response = await httpClient.post('/employees', newEmployeeData);
			expect(response.statusCode).to.be.eq(HttpStatus.FORBIDDEN);
		});
	});

	describe('As admin user', () => {
		it('Should be able to retrieve employee list (/employees)', async () => {
			const httpClient = await getHttpClient(users.admin, app);
			const response = await httpClient.get('/employees');
			expect(response.statusCode).to.be.eq(HttpStatus.OK);
			expect(response.json<Employee[]>()).to.be.instanceOf(Array);
			expect(response.json<Employee[]>().length).to.be.gt(0);
		});

		it('Should be able to create a employee (POST /employees)', async () => {
			const httpClient = await getHttpClient(users.admin, app);
			const user = await userService.create(UserFactory.buildOne());
			const business = await businessService.create(BusinessFactory.buildOne());
			const newEmployeeData = EmployeeFactory.buildOne(user, business);
			const response = await httpClient.post('/employees', newEmployeeData);
			expect(response.statusCode).to.be.eq(HttpStatus.CREATED);
			createdEmployees.push(response.json<Employee>());
		});

		it('Should be able to update a employee (PATCH /employees/:id)', async () => {
			const httpClient = await getHttpClient(users.admin, app);
			// Create an employee
			const employee = await TestUtils.createEmployee(userService, businessService, employeeService);
			createdEmployees.push(employee);

			// Update it
			const newEmployeeData = { telNumber: faker.phone.number() };
			const response = await httpClient.patch(`/employees/${employee.id}`, newEmployeeData);
			expect(response.statusCode).to.be.eq(HttpStatus.OK);
			expect(response.json<Employee>().telNumber).to.be.eq(newEmployeeData.telNumber);
		});

		it('Should be able to delete a employee (DELETE /employees/:id)', async () => {
			const httpClient = await getHttpClient(users.admin, app);
			// Create an employee
			const employee = await TestUtils.createEmployee(userService, businessService, employeeService);
			createdEmployees.push(employee);

			// Delete it
			let response = await httpClient.delete(`/employees/${createdEmployees[createdEmployees.length - 1].id}`);
			expect(response.statusCode).to.be.eq(HttpStatus.OK);

			response = await httpClient.get(`/employees/${createdEmployees[createdEmployees.length - 1].id}`);
			expect(response.statusCode).to.be.eq(HttpStatus.NOT_FOUND);
			createdEmployees.pop();
		});
	});

	this.afterEach(async () => {
		const httpClient = await getHttpClient(users.admin, app);
		for (const employee of createdEmployees) {
			await httpClient.delete(`/employees/${employee.id}`);
		}
		await httpClient.delete(`/users/${users.basic.id}`);
		await httpClient.delete(`/users/${users.admin.id}`);
	});
});
