import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class CreateScheduledMessageDto {
  @IsString()
  content: string;

  // @IsBoolean()
  // hasMedia: boolean;

  @IsBoolean()
  frecuency: boolean;

  @IsString()
  deviceType: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsDate()
  scheduledTime: Date;

  @IsString()
  recipient: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
