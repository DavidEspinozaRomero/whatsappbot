import { PartialType } from '@nestjs/mapped-types';
import { CreateBotwDto } from './create-botw.dto';

export class UpdateBotwDto extends PartialType(CreateBotwDto) {
  id: number;
}
