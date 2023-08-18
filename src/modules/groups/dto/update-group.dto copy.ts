import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupManagementDto } from './create-group-management.dto';

export class UpdateGroupManagementDto extends PartialType(
  CreateGroupManagementDto
) {}
