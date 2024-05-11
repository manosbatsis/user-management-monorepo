import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SecurityModule } from '../security/security.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [UserModule,
		PassportModule,
		SecurityModule,
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '60m' },
		}),],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	exports: [AuthService]
})
export class AuthModule {}
