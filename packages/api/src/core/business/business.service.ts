import { BusinessDoesNotExistException } from '../exceptions/exceptions';

import CreateBusinessDTO from './dto/create-business.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { SecurityService } from '../security/security.service';
import UpdateBusinessDTO from './dto/update-business.dto';
import Business from './entities/business.entity';
import BusinessRepository from './business.repository';

@Injectable()
export class BusinessService {
	constructor(
		private prisma: PrismaService,
		private securityService: SecurityService,
		private businessRepository: BusinessRepository
	) {}

	async create(createBusinessDto: CreateBusinessDTO): Promise<Business> {
		// Create business
		return await this.businessRepository.create({ ...createBusinessDto });
	}

	async findAll(): Promise<Business[]> {
		return await this.businessRepository.findAll();
	}

	async findOne(id: string): Promise<Business> {
		return await this.businessRepository.findOne(id);
	}

	async update(id: string, data: UpdateBusinessDTO): Promise<Business> {
		const business = await this.prisma.business.findFirst({ where: { id } });
		const updateData = { ...data };
		// Check business existence
		if (!business) {
			throw new BusinessDoesNotExistException();
		}
		// Update the business
		return await this.businessRepository.update(id, updateData);
	}

	async remove(id: string): Promise<void> {
		const business = await this.findOne(id);
		if (!business) {
			throw new BusinessDoesNotExistException();
		}
		await this.businessRepository.remove(id);
	}
}
