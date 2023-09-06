import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreatePredefinedResponseDto {
  @IsString()
  @MinLength(1)
  content: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  idAction: number;

  @IsNumber()
  @IsOptional()
  nextResponse: number;

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
