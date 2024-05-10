import { faker } from '@faker-js/faker';
import Employee, { EmployeePosition } from './entities/employee.entity';
import User from '../user/entities/user.entity';
import Business from '../business/entities/business.entity';
import { UserService } from '../user/user.service';
import { BusinessService } from '../business/business.service';

export default class EmployeeFactory {
	public static buildOne(user: User, business: Business): Employee {
		return {
			businessId: business.id,
			userId: user.id,
			telNumber: faker.phone.number(),
			position: faker.helpers.enumValue(EmployeePosition)
		} as Employee;
	}

	public static buildMany(n: number, user: User, business: Business): Employee[] {
		const res = [];
		for (let i = 0; i < n; i++) {
			res.push(EmployeeFactory.buildOne(user, business));
		}
		return res;
	}
}
