import 'mocha';

import { EmployeeDoesNotExistException } from '../exceptions/exceptions';
import { Test, TestingModule } from '@nestjs/testing';
import chai, { expect } from 'chai';

import { PrismaService } from '../../prisma.service';
import { SecurityModule } from '../security/security.module';
import EmployeeFactory from './employee.factory';
import { EmployeeService } from './employee.service';
import chaiAsPromised from 'chai-as-promised';
import chaiSubset from 'chai-subset';
import Employee, { EmployeePosition } from './entities/employee.entity';
import EmployeeRepository from './employee.repository';
import UserFactory from '../user/user.factory';
import BusinessFactory from '../business/business.factory';
import { UserService } from '../user/user.service';
import { BusinessService } from '../business/business.service';
import { faker } from '@faker-js/faker';
import { BusinessModule } from '../business/business.module';
import { UserModule } from '../user/user.module';

chai.use(chaiSubset);
chai.use(chaiAsPromised);

const createdEmployees: Employee[] = [];

async function createEmployee(
	employeeService: EmployeeService,
	userService: UserService,
	businessService: BusinessService
) {
	const user = UserFactory.buildOne();
	const createdUser = await userService.create(user);
	const business = BusinessFactory.buildOne();
	const createdBusiness = await businessService.create(business);
	const employee = EmployeeFactory.buildOne(createdUser, createdBusiness);
	const createdEmployee = await employeeService.create(employee);
	expect(createdEmployee).containSubset(employee);
	createdEmployees.push(createdEmployee);
	return createdEmployee;
}

describe('EmployeeService', () => {
	let employeeService: EmployeeService;
	let userService: UserService;
	let businessService: BusinessService;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [SecurityModule, BusinessModule, UserModule],
			providers: [EmployeeService, PrismaService, EmployeeRepository]
		}).compile();

		employeeService = module.get<EmployeeService>(EmployeeService);
		userService = module.get<UserService>(UserService);
		businessService = module.get<BusinessService>(BusinessService);
	});

	afterEach(async () => {
		for (const employee of createdEmployees) {
			try {
				await employeeService.remove(employee.id);
			} catch (e) {}
		}
		//await module.get(PrismaService).$disconnect();
		await module.close();
	});
	it('should be defined', () => {
		expect(employeeService).to.not.be.null;
	});

	describe('findAll', () => {
		it('Should return an array of employees', async () => {
			expect(await employeeService.findAll()).to.be.instanceOf(Array);
		});
	});

	describe('create', () => {
		it('Should create a employee', async () => {
			await createEmployee(employeeService, userService, businessService);
		});
	});

	describe('find', () => {
		it('Should find the created employee', async () => {
			const employee = await createEmployee(employeeService, userService, businessService);
			expect(await employeeService.findOne(employee.id)).containSubset(employee);
		});

		it('Should not find an invalid employee', async () => {
			expect(await employeeService.findOne('invalid_id')).to.be.null;
		});
	});

	describe('update', () => {
		it('Should update the created employee', async () => {
			const employee = await createEmployee(employeeService, userService, businessService);
			console.log('employee', employee);
			const newEmployeeData = {
				...employee,
				telNumber: faker.phone.number(),
				position: faker.helpers.enumValue(EmployeePosition)
			};
			console.warn('newEmployeeData', newEmployeeData);
			const updatedEmployee = await employeeService.update(employee.id, newEmployeeData);
			console.warn('updatedEmployee', updatedEmployee);
			expect(updatedEmployee).containSubset(newEmployeeData);
		});

		it('Should not update an invalid employee', async () => {
			await expect(employeeService.update('invalid_employee', { telNumber: faker.phone.number() })).to.be.rejectedWith(
				EmployeeDoesNotExistException
			);
		});
	});

	describe('remove', () => {
		it('Should delete the created employee', async () => {
			const employee = await createEmployee(employeeService, userService, businessService);
			await employeeService.remove(employee.id);
			expect(await employeeService.findOne(employee.id)).to.be.null;
		});

		it('Should not delete an invalid employee', async () => {
			await expect(employeeService.remove('invalid_employee')).to.be.rejectedWith(EmployeeDoesNotExistException);
		});
	});
});
