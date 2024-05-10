import { NestFastifyApplication } from '@nestjs/platform-fastify';
import User, { UserRole } from '../src/core/user/entities/user.entity';
import UserFactory from '../src/core/user/user.factory';
import { UserService } from '../src/core/user/user.service';
import HttpClient from './HttpClient';
import { BusinessService } from '../src/core/business/business.service';
import Business from '../src/core/business/entities/business.entity';
import BusinessFactory from '../src/core/business/business.factory';
import EmployeeFactory from '../src/core/employee/employee.factory';
import { EmployeeService } from '../src/core/employee/employee.service';
import Employee from '../src/core/employee/entities/employee.entity';

export default class TestUtils {
	public static async createUser(userService: UserService): Promise<User> {
		const user = UserFactory.buildOne();
		return await userService.create(user);
	}

	public static async createBasicAndAdminUsers(userService: UserService): Promise<{ basic: User; admin: User }> {
		const basic = UserFactory.buildOne();
		const admin = UserFactory.buildOne();
		admin.role = UserRole.ADMIN;

		const createdBasic = await userService.create(basic);
		const createdAdmin = await userService.create(admin);
		createdBasic.password = basic.password;
		createdAdmin.password = admin.password;

		return { basic: createdBasic, admin: createdAdmin };
	}

	public static async createBusiness(businessService: BusinessService): Promise<Business> {
		const business = BusinessFactory.buildOne();
		return await businessService.create(business);
	}

	public static async createBusinesses(
		businessService: BusinessService
	): Promise<{ first: Business; second: Business }> {
		const first = await TestUtils.createBusiness(businessService);
		const second = await TestUtils.createBusiness(businessService);

		return { first, second };
	}

	public static async createEmployee(
		userService: UserService,
		businessService: BusinessService,
		employeeService: EmployeeService
	): Promise<Employee> {
		const user = await TestUtils.createUser(userService);
		const business = await TestUtils.createBusiness(businessService);

		return await employeeService.create(EmployeeFactory.buildOne(user, business));
	}

	public static async createEmployees(
		userService: UserService,
		businessService: BusinessService,
		employeeService: EmployeeService
	): Promise<{ first: Business; second: Business }> {
		const first = BusinessFactory.buildOne();
		const second = BusinessFactory.buildOne();

		const createdFirst = await businessService.create(first);
		const createdSecond = await businessService.create(second);

		return { first: createdFirst, second: createdSecond };
	}
}

export async function getHttpClient(user: User, app: NestFastifyApplication): Promise<HttpClient> {
	const httpClient = new HttpClient(app);
	await httpClient.logAsUser(user);
	return httpClient;
}
