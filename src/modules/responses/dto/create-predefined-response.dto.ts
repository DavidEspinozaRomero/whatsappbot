import { IsArray, IsDate, IsString, MinLength } from 'class-validator';

export class CreatePredefinedResponseDto {
  @IsArray()
  @MinLength(1)
  content: string[];

  @IsString()
  responseType: string; // (e.g., FAQs, atention hours, services)

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  // @IsString()
  // sendAt: string;
}
