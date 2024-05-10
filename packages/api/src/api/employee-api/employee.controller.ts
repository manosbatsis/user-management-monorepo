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
import { TokenGuard } from '../../core/guards/token.guard';
import { EmployeeService } from '../../core/employee/employee.service';
import {
	ApiBody,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags
} from '@nestjs/swagger';
import CreateEmployeeDTO from '../../core/employee/dto/create-employee.dto';
import UpdateEmployeeDTO from '../../core/employee/dto/update-employee.dto';
import Employee from '../../core/employee/entities/employee.entity';
import { UserRole } from '../../core/user/entities/user.entity';

@Controller('employees')
@ApiTags('Employees')
@UseGuards(TokenGuard, RoleGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class EmployeeController {
	constructor(private readonly employeeService: EmployeeService) {}

	@Post()
	@Roles(UserRole.ADMIN)
	@ApiBody({ type: CreateEmployeeDTO })
	@ApiOperation({ summary: 'Create a employee' })
	@ApiCreatedResponse({ description: 'Employee created successfully', type: Employee })
	async create(@Req() request: Request, @Body() createEmployeeDto: CreateEmployeeDTO) {
		return await this.employeeService.create({ ...createEmployeeDto });
	}

	@Get()
	@Roles(UserRole.ADMIN)
	@ApiOperation({ summary: 'Retrieve all employees' })
	@ApiOkResponse({ description: 'Successfully retrieved employee list', type: [Employee] })
	async findAll() {
		return await this.employeeService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Retrieve a employee' })
	@ApiOkResponse({ description: 'Successfully retrieved employee', type: Employee })
	@ApiNotFoundResponse({ description: 'Employee does not exists' })
	async findOne(@Param('id') id: string) {
		const employee = await this.employeeService.findOne(id);
		if (!employee) {
			throw new NotFoundException();
		}
		return employee;
	}

	@Patch(':id')
	@Roles(UserRole.ADMIN)
	@ApiBody({ type: UpdateEmployeeDTO })
	@ApiOperation({ summary: 'Update a employee' })
	@ApiOkResponse({ description: 'Successfully updated employee', type: Employee })
	async update(@Req() request: Request, @Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDTO) {
		return await this.employeeService.update(id, updateEmployeeDto);
	}

	@Delete(':id')
	@Roles(UserRole.ADMIN)
	@ApiOperation({ summary: 'Delete a employee' })
	@ApiOkResponse({ description: 'Successfully deleted employee', type: Employee })
	@ApiNotFoundResponse({ description: 'Employee does not exists' })
	async remove(@Param('id') id: string) {
		return await this.employeeService.remove(id);
	}
}
