import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { SecurityModule } from '../security/security.module';
import BusinessRepository from './business.repository';
import { BusinessService } from './business.service';

@Module({
	imports: [SecurityModule],
	providers: [BusinessService, BusinessRepository, PrismaService],
	exports: [BusinessService]
})
export class BusinessModule {}
