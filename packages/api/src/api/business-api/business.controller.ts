import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Req,
	UseGuards,
	UseInterceptors
} from '@nestjs/common';
import { Request } from 'express';
import { RoleGuard } from '../../core/guards/role.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { BusinessService } from '../../core/business/business.service';
import {
	ApiBody,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags
} from '@nestjs/swagger';
import CreateBusinessDTO from '../../core/business/dto/create-business.dto';
import UpdateBusinessDTO from '../../core/business/dto/update-business.dto';
import Business from '../../core/business/entities/business.entity';
import { UserRole } from '../../core/user/entities/user.entity';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';

@Controller('businesses')
@ApiTags('Businesses')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class BusinessController {
	constructor(private readonly businessService: BusinessService) {}

	@Post()
	@Roles(UserRole.ADMIN)
	@ApiBody({ type: CreateBusinessDTO })
	@ApiOperation({ summary: 'Create a business' })
	@ApiCreatedResponse({ description: 'Business created successfully', type: Business })
	async create(@Req() request: Request, @Body() createBusinessDto: CreateBusinessDTO) {
		return await this.businessService.create({ ...createBusinessDto });
	}

	@Get()
	@Roles(UserRole.ADMIN)
	@ApiOperation({ summary: 'Retrieve all businesses' })
	@ApiOkResponse({ description: 'Successfully retrieved business list', type: [Business] })
	async findAll() {
		return await this.businessService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Retrieve a business' })
	@ApiOkResponse({ description: 'Successfully retrieved business', type: Business })
	@ApiNotFoundResponse({ description: 'Business does not exists' })
	async findOne(@Param('id') id: string) {
		const business = await this.businessService.findOne(id);
		if (!business) {
			throw new NotFoundException();
		}
		return business;
	}

	@Patch(':id')
	@Roles(UserRole.ADMIN)
	@ApiBody({ type: UpdateBusinessDTO })
	@ApiOperation({ summary: 'Update a business' })
	@ApiOkResponse({ description: 'Successfully updated business', type: Business })
	async update(@Req() request: Request, @Param('id') id: string, @Body() updateBusinessDto: UpdateBusinessDTO) {
		return await this.businessService.update(id, updateBusinessDto);
	}

	@Delete(':id')
	@Roles(UserRole.ADMIN)
	@ApiOperation({ summary: 'Delete a business' })
	@ApiOkResponse({ description: 'Successfully deleted business', type: Business })
	@ApiNotFoundResponse({ description: 'Business does not exists' })
	async remove(@Param('id') id: string) {
		return await this.businessService.remove(id);
	}
}
