import { faker } from '@faker-js/faker';
import User from './entities/user.entity';

export default class UserFactory {
	public static buildOne(): User {
		return {
			email: faker.internet.email().toLowerCase(),
			password: faker.internet.password(),
			firstName: faker.person.firstName(),
			lastName: faker.person.lastName()
		} as User;
	}

	public static buildMany(n: number): User[] {
		const res = [];
		for (let i = 0; i < n; i++) {
			res.push(UserFactory.buildOne());
		}
		return res;
	}
}
