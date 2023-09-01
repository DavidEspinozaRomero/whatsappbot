import {
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreatePredefinedResponseDto {
  @IsArray()
  @MinLength(1)
  content: string;

  @IsString()
  state: string; // (e.g., FAQs, atention hours, services, welcome)

  @IsString()
  @IsOptional()
  nextResponse: string; // (e.g., FAQs, atention hours, services, welcome)

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsDate()
  @IsOptional()
  updatedAt: Date;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  // @IsString()
  // sendAt: string;
}
