import { IsBoolean, IsDate, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsBoolean()
  hasMedia: boolean;

  @IsDate()
  send_at: Date;
}
