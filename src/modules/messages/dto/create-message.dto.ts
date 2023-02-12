import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateMessageDto {

  @IsArray()
  keywords: string[];

  @IsString()
  @MinLength(2)
  answer: string;

  @IsString()
  @MinLength(2)
  startTime: string;

  @IsString()
  @MinLength(2)
  endTime: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  category: number;
}
