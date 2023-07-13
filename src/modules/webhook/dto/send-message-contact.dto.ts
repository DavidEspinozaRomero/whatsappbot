import { IsNumber, IsString } from 'class-validator';

export class SendMessageToContactDto {
  @IsNumber()
  id: number;

  @IsString()
  content: string;
}
