import { PartialType } from '@nestjs/mapped-types';
import { CreateBotWebwhatsapDto } from './create-bot-webwhatsap.dto';

export class UpdateBotWebwhatsapDto extends PartialType(CreateBotWebwhatsapDto) {}
