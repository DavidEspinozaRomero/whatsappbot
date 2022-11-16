import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateMessageDto {

  @IsString()
  @MinLength(2)
  query: string;

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
  @Max(5)
  @IsOptional()
  category: number;
}
