import CreateBusinessDTO from './create-business.dto';
import { PartialType } from '@nestjs/swagger';

export default class UpdateBusinessDTO extends PartialType(CreateBusinessDTO) {}
