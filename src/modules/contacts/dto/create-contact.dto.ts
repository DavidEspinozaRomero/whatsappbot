import { IsBoolean, IsDate, IsString, MinLength } from 'class-validator';

export class CreateContactDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(10)
  cellphone: string;

  @IsBoolean()
  isBlocked:boolean;

  @IsDate()
  created_at: Date;

  @IsDate()
  last_seen: Date;
}
