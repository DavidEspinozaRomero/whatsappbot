import { IsDate, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  @MinLength(1)
  mediaType: string;

  @IsString()
  @MinLength(1)
  mediaURL: string;

  // @IsDate()
  // uploadedAt: Date;

  @IsDate()
  @IsOptional()
  lastUpdate: Date;

  @IsString()
  @MinLength(1)
  description: string;
}
