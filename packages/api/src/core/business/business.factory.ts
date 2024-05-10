import { faker } from '@faker-js/faker';
import Business, { BusinessType } from './entities/business.entity';

export default class BusinessFactory {
	public static buildOne(): Business {
		return {
			name: faker.company.name(),
			location: faker.location.streetAddress(),
			type: faker.helpers.enumValue(BusinessType)
		} as Business;
	}

	public static buildMany(n: number): Business[] {
		const res = [];
		for (let i = 0; i < n; i++) {
			res.push(BusinessFactory.buildOne());
		}
		return res;
	}
}
