import 'mocha';

import { BusinessDoesNotExistException } from '../exceptions/exceptions';
import { Test, TestingModule } from '@nestjs/testing';
import chai, { expect } from 'chai';

import { PrismaService } from '../../prisma.service';
import { SecurityModule } from '../security/security.module';
import BusinessFactory from './business.factory';
import { BusinessService } from './business.service';
import chaiAsPromised from 'chai-as-promised';
import chaiSubset from 'chai-subset';
import Business from './entities/business.entity';
import BusinessRepository from './business.repository';

chai.use(chaiSubset);
chai.use(chaiAsPromised);

const createdBusinesss: Business[] = [];

async function createBusiness(businessService: BusinessService) {
	const business = BusinessFactory.buildOne();
	const createdBusiness = await businessService.create(business);
	expect(createdBusiness).containSubset(business);
	createdBusinesss.push(createdBusiness);
	return createdBusiness;
}

describe('BusinessService', () => {
	let businessService: BusinessService;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [SecurityModule],
			providers: [BusinessService, PrismaService, BusinessRepository]
		}).compile();

		businessService = module.get<BusinessService>(BusinessService);
	});

	afterEach(async () => {
		for (const business of createdBusinesss) {
			try {
				await businessService.remove(business.id);
			} catch (e) {}
		}
		//await module.get(PrismaService).$disconnect();
		await module.close();
	});
	it('should be defined', () => {
		expect(businessService).to.not.be.null;
	});

	describe('findAll', () => {
		it('Should return an array of businesss', async () => {
			expect(await businessService.findAll()).to.be.instanceOf(Array);
		});
	});

	describe('create', () => {
		it('Should create a business', async () => {
			await createBusiness(businessService);
		});

		it('Should not create a business without name', async () => {
			const business = BusinessFactory.buildOne();
			delete business.name;

			await expect(
				businessService.create({
					name: business.name,
					location: business.location,
					type: business.type
				})
			).to.be.rejectedWith(Error);
		});
	});

	describe('find', () => {
		it('Should find the created business', async () => {
			const business = await createBusiness(businessService);
			expect(await businessService.findOne(business.id)).containSubset(business);
		});

		it('Should not find an invalid business', async () => {
			expect(await businessService.findOne('invalid_id')).to.be.null;
		});
	});

	describe('update', () => {
		it('Should update the created business', async () => {
			const business = await createBusiness(businessService);
			const newBusinessData = BusinessFactory.buildOne();
			const updatedBusiness = await businessService.update(business.id, {
				name: newBusinessData.name,
				location: newBusinessData.location,
				type: newBusinessData.type
			});
			expect(updatedBusiness).containSubset(newBusinessData);
		});

		it('Should not update an invalid business', async () => {
			const newBusinessData = BusinessFactory.buildOne();
			await expect(businessService.update('invalid_business', { name: newBusinessData.name })).to.be.rejectedWith(
				BusinessDoesNotExistException
			);
		});
	});

	describe('remove', () => {
		it('Should delete the created business', async () => {
			const business = await createBusiness(businessService);
			await businessService.remove(business.id);
			expect(await businessService.findOne(business.id)).to.be.null;
		});

		it('Should not delete an invalid business', async () => {
			await expect(businessService.remove('invalid_business')).to.be.rejectedWith(BusinessDoesNotExistException);
		});
	});
});
