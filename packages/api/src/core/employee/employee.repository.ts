import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import CreateEmployeeDTO from './dto/create-employee.dto';
import UpdateEmployeeDTO from './dto/update-employee.dto';
import Employee from './entities/employee.entity';

@Injectable()
export default class EmployeeRepository {
	constructor(private prisma: PrismaService) {}

	public async create(dto: CreateEmployeeDTO): Promise<Employee> {
		return Employee.from(
			await this.prisma.employee.create({
				data: {
					userId: dto.userId,
					businessId: dto.businessId,
					telNumber: dto.telNumber,
					position: dto.position
				}
			})
		);
	}

	public async findAll(): Promise<Employee[]> {
		return (await this.prisma.employee.findMany()).map((u) => Employee.from(u));
	}

	public async findOne(id: string): Promise<Employee> {
		return Employee.from(await this.prisma.employee.findUnique({ where: { id } }));
	}

	public async remove(id: string): Promise<void> {
		await this.prisma.employee.delete({ where: { id } });
	}

	public async update(id: string, dto: UpdateEmployeeDTO): Promise<Employee> {
		return Employee.from(await this.prisma.employee.update({ where: { id }, data: dto }));
	}
}
