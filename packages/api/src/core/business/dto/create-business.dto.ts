import { ApiProperty } from '@nestjs/swagger';
import { BusinessType } from '../entities/business.entity';

export default class CreateBusinessDTO {
	@ApiProperty()
	name: string;

	@ApiProperty()
	location: string;

	@ApiProperty({ enum: BusinessType })
	type?: BusinessType;
}
