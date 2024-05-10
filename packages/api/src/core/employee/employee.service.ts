import { EmployeeDoesNotExistException } from '../exceptions/exceptions';

import CreateEmployeeDTO from './dto/create-employee.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { SecurityService } from '../security/security.service';
import UpdateEmployeeDTO from './dto/update-employee.dto';
import Employee from './entities/employee.entity';
import EmployeeRepository from './employee.repository';

@Injectable()
export class EmployeeService {
	constructor(
		private prisma: PrismaService,
		private securityService: SecurityService,
		private employeeRepository: EmployeeRepository
	) {}

	async create(createEmployeeDto: CreateEmployeeDTO): Promise<Employee> {
		// Create employee
		return await this.employeeRepository.create({ ...createEmployeeDto });
	}

	async findAll(): Promise<Employee[]> {
		return await this.employeeRepository.findAll();
	}

	async findOne(id: string): Promise<Employee> {
		return await this.employeeRepository.findOne(id);
	}

	async update(id: string, data: UpdateEmployeeDTO): Promise<Employee> {
		const employee = await this.prisma.employee.findFirst({ where: { id } });
		const updateData = { ...data };
		// Check employee existence
		if (!employee) {
			throw new EmployeeDoesNotExistException();
		}
		// Update the employee
		return await this.employeeRepository.update(id, updateData);
	}

	async remove(id: string): Promise<void> {
		const employee = await this.findOne(id);
		if (!employee) {
			throw new EmployeeDoesNotExistException();
		}
		await this.employeeRepository.remove(id);
	}
}
