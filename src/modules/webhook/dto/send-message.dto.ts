import {  IsString } from "class-validator";

export class SendMessageDto {
  
  @IsString()
  cellphone: string;
  
  @IsString()
  content: string;

}