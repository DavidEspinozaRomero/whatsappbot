import { IsDate, IsString } from "class-validator";

export class CreateMessageDto {

  @IsString()
  texto: string;
  @IsString()
  category: string;
  @IsString()
  horary: string;
}
