import CreateEmployeeDTO from './create-employee.dto';
import { PartialType } from '@nestjs/swagger';

export default class UpdateEmployeeDTO extends PartialType(CreateEmployeeDTO) {}
