import { PartialType } from '@nestjs/mapped-types';
import { CreatePredefinedResponseDto } from './create-predefined-response.dto';

export class UpdatePredefinedResponseDto extends PartialType(
  CreatePredefinedResponseDto
) {}
