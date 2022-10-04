import { IsDate, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @MinLength(2)
  message: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  category: string;

  @IsOptional()
  @IsString()
  date: string;
}
