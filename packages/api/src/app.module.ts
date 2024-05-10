import { AuthModule } from './core/auth/auth.module';
import { Module } from '@nestjs/common';
import { SecurityModule } from './core/security/security.module';
import { SecurityService } from './core/security/security.service';
import { UserModule } from './core/user/user.module';
import { UserApiModule } from './api/user-api/user-api.module';
import { AuthApiModule } from './api/auth-api/auth-api.module';
import { BusinessModule } from './core/business/business.module';
import { BusinessApiModule } from './api/business-api/business-api.module';
import { EmployeeModule } from './core/employee/employee.module';
import { EmployeeApiModule } from './api/employee-api/employee-api.module';

@Module({
	imports: [
		AuthApiModule,
		AuthModule,
		BusinessApiModule,
		BusinessModule,
		EmployeeApiModule,
		EmployeeModule,
		SecurityModule,
		UserApiModule,
		UserModule
	],
	controllers: [],
	providers: [SecurityService]
})
export class AppModule {}
