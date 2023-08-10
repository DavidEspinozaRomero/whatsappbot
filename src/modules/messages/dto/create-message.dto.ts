import { IsBoolean, IsDate, IsString } from 'class-validator';
import { MessageTypes } from 'whatsapp-web.js';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsBoolean()
  hasMedia: boolean;

  @IsBoolean()
  fromMe: boolean;

  @IsString()
  deviceType: string;

  @IsString()
  type: MessageTypes;

  @IsDate()
  send_at: Date;
}
