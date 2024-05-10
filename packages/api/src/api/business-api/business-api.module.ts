import { Module } from '@nestjs/common';
import { BusinessModule } from '../../core/business/business.module';
import { BusinessController } from './business.controller';
import { UserModule } from '../../core/user/user.module';

@Module({
	controllers: [BusinessController],
	imports: [BusinessModule, UserModule]
})
export class BusinessApiModule {}
