import { ApiProperty } from '@nestjs/swagger';
import { EmployeePosition } from '../entities/employee.entity';

export default class CreateEmployeeDTO {
	@ApiProperty()
	userId: string;

	@ApiProperty()
	businessId: string;

	@ApiProperty()
	telNumber?: string;

	@ApiProperty({ enum: EmployeePosition })
	position: EmployeePosition;
}
