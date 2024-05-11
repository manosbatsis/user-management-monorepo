import { Injectable } from '@nestjs/common';
import { SecurityService } from '../security/security.service';
import { UserService } from '../user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import User from 'src/core/user/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private securityService: SecurityService,
		private jwtService: JwtService
	) {}

	async validateUser(email: string, password: string): Promise<User> {
		console.log('validateUser', email, password);
		const hashedPassword = this.securityService.hashPassword(password);
		console.log('validateUser, hashedPassword', hashedPassword);
		let user = await this.userService.findOneByEmail(email, true);
		console.log('validateUser', user);
		if (user && this.securityService.comparePasswords(password, user.password)) {
			// Delete the password from the response
			delete user.password;
			// Add the latest token to the response
			return user;
		}
		return null;
	}

	async login(user: User) {
		const payload = { username: user.email, sub: user.id };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}
