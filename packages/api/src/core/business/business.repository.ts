import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import CreateBusinessDTO from './dto/create-business.dto';
import UpdateBusinessDTO from './dto/update-business.dto';
import Business from './entities/business.entity';

@Injectable()
export default class BusinessRepository {
	constructor(private prisma: PrismaService) {}

	public async create(dto: CreateBusinessDTO): Promise<Business> {
		return Business.from(
			await this.prisma.business.create({
				data: {
					name: dto.name,
					location: dto.location,
					type: dto.type
				}
			})
		);
	}

	public async findAll(): Promise<Business[]> {
		return (await this.prisma.business.findMany()).map((u) => Business.from(u));
	}

	public async findOne(id: string): Promise<Business> {
		return Business.from(await this.prisma.business.findUnique({ where: { id } }));
	}

	public async remove(id: string): Promise<void> {
		await this.prisma.business.delete({ where: { id } });
	}

	public async update(id: string, dto: UpdateBusinessDTO): Promise<Business> {
		return Business.from(await this.prisma.business.update({ where: { id }, data: dto }));
	}
}
