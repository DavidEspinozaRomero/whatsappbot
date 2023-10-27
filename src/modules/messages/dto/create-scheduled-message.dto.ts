import {
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @IsArray()
  recipient: number[];

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
