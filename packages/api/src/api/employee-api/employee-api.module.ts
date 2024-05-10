import { Module } from '@nestjs/common';
import { EmployeeModule } from '../../core/employee/employee.module';
import { EmployeeController } from './employee.controller';
import { UserModule } from '../../core/user/user.module';

@Module({
	controllers: [EmployeeController],
	imports: [EmployeeModule, UserModule]
})
export class EmployeeApiModule {}
