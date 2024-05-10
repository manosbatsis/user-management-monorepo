import { ApiProperty } from '@nestjs/swagger';
import { Employee as PrismaEmployee } from '@prisma/client';

export enum EmployeePosition {
	KITCHEN = 'kitchen',
	SERVICE = 'service',
	PR = 'PR'
}

export default class Employee {
	@ApiProperty()
	id: string;

	@ApiProperty()
	userId: string;

	@ApiProperty()
	businessId: string;

	@ApiProperty()
	telNumber?: string;

	@ApiProperty({ enum: EmployeePosition })
	position: EmployeePosition;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;

	constructor() {}

	public static from(prismaEmployee: PrismaEmployee) {
		if (!prismaEmployee) {
			return null;
		}
		const employee = new Employee();
		Object.assign(employee, { ...prismaEmployee });
		return employee;
	}
}
