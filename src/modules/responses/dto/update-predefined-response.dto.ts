import { PartialType } from '@nestjs/mapped-types';
import { CreateResponseDto } from './create-response.dto';

export class UpdatePredefinedResponseDto extends PartialType(
  CreateResponseDto
) {}
