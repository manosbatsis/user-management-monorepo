import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { SecurityModule } from '../security/security.module';
import EmployeeRepository from './employee.repository';
import { EmployeeService } from './employee.service';

@Module({
	imports: [SecurityModule],
	providers: [EmployeeService, EmployeeRepository, PrismaService],
	exports: [EmployeeService]
})
export class EmployeeModule {}
