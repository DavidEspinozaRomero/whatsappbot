import { IsDate, IsString, MinLength } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  @MinLength(1)
  mediaType: string;

  @IsString()
  @MinLength(1)
  mediaURL: string;

  @IsDate()
  uploadedAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsString()
  description: string;
}
