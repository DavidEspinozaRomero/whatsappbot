import { IsBoolean, IsDate, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @MinLength(2)
  message: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  category: number;

  @IsNumber()
  @IsOptional()
  type: number;

  @IsOptional()
  @IsString()
  date: string;
}
