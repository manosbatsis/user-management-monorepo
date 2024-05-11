import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';

@Injectable()
export class SecurityService {
	private nbRounds = 10;

	hashPassword(password: string): string {
		return bcrypt.hashSync(password, this.nbRounds);
	}

	comparePasswords(password: string, hash: string): boolean {
		const result = bcrypt.compareSync(password, hash);
		return result;
	}
}
