import { IsBoolean, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateQueryMessageDto {
  @IsString()
  @MinLength(2)
  message: string;

  @IsString()
  @MinLength(2)
  query: string;

  // @IsString()
  // @MinLength(2)
  // @IsOptional()
  // category: number;

  // @IsNumber()
  // @IsOptional()
  // type: number;

}
