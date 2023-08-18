import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreatePredefinedResponseDto {
  @IsArray()
  @MinLength(1)
  content: string[];

  @IsString()
  responseType: string; // (e.g., FAQs, atention hours, services, welcome)

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsDate()
  @IsOptional()
  updatedAt: Date;

  // @IsString()
  // sendAt: string;
}
