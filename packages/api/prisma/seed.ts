//
import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {

	// Users
	const admin = await prisma.user.upsert({
		where: { email: 'admin@test.com' },
		update: {},
		create: {
			email: 'admin@test.com',
			password: '$2b$10$D13NJFjXbQkjFvG.13ZX1ehPy.2X0shqavU..cXgAuDA0sgHuoaKG',
			firstName: 'Admin',
			lastName: 'User',
			role: 'admin'
		}
	});

	const basic = await prisma.user.upsert({
		where: { email: 'basic@test.com' },
		update: {},
		create: {
			email: 'basic@test.com',
			password: '$2b$10$D13NJFjXbQkjFvG.13ZX1ehPy.2X0shqavU..cXgAuDA0sgHuoaKG',
			firstName: 'Basic',
			lastName: 'User',
			role: 'basic'
		}
	});

	const john = await prisma.user.upsert({
		where: { email: 'john@test.com' },
		update: {},
		create: {
			email: 'john@test.com',
			password: '$2b$10$D13NJFjXbQkjFvG.13ZX1ehPy.2X0shqavU..cXgAuDA0sgHuoaKG',
			firstName: 'John',
			lastName: 'User',
			role: 'basic'
		}
	});

	const joan = await prisma.user.upsert({
		where: { email: 'joan@test.com' },
		update: {},
		create: {
			email: 'joan@test.com',
			password: '$2b$10$D13NJFjXbQkjFvG.13ZX1ehPy.2X0shqavU..cXgAuDA0sgHuoaKG',
			firstName: 'Joan',
			lastName: 'User',
			role: 'basic'
		}
	});

	// Businesses
	const biz1 = await prisma.business.upsert({
		where: { name: 'United Grill' },
		update: {},
		create: {
			name: 'United Steel',
			location: '3 Random Av. 555 Palindromia',
			type: 'RESTAURANT',
		}
	});
	const biz2 = await prisma.business.upsert({
		where: { name: 'Java Mania' },
		update: {},
		create: {
			name: 'Java Mania',
			location: '4 Monkeydome Av. 555 Palindromia',
			type: 'CAFE',
		}
	});

	// Employees
	const employee1 = await prisma.employee.upsert({
		where: { businessEmployeeIdentifier: { businessId: biz1.id, userId: john.id } },
		update: {},
		create: {
			businessId: biz1.id,
			userId: john.id,
			position: 'SERVICE'
		}
	});
	const employee2 = await prisma.employee.upsert({
		where: { businessEmployeeIdentifier: { businessId: biz2.id, userId: joan.id } },
		update: {},
		create: {
			businessId: biz2.id,
			userId: joan.id,
			position: 'SERVICE'
		}
	});
}

// execute the main function
main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		// close Prisma Client at the end
		await prisma.$disconnect();
	});
