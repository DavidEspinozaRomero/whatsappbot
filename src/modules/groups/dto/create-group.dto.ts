import {
  IsArray,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateGroupDto {
  @IsNumber()
  id: number;

  @IsString()
  @MinLength(1)
  groupName: string;

  @IsArray()
  groupMembers: number[]; // (Array of Contacts IDs)

  @IsString()
  description: string;
}
