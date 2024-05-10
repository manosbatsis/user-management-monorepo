import { ApiProperty } from '@nestjs/swagger';
import { Business as PrismaBusiness } from '@prisma/client';

export enum BusinessType {
	BAR = 'basic',
	RESTAURANT = 'restaurant',
	CLUB = 'club',
	HOTEL = 'hotel',
	CAFE = 'cafe'
}

export default class Business {
	@ApiProperty()
	id: string;

	@ApiProperty()
	name: string;

	@ApiProperty()
	location: string;

	@ApiProperty({ enum: BusinessType })
	type?: BusinessType;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;

	constructor() {}

	public static from(prismaBusiness: PrismaBusiness) {
		if (!prismaBusiness) {
			return null;
		}
		const business = new Business();
		Object.assign(business, { ...prismaBusiness });
		return business;
	}
}
