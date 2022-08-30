import { Module } from '@nestjs/common';
import { BotWebwhatsapService } from './bot-webwhatsap.service';
import { BotWebwhatsapController } from './bot-webwhatsap.controller';

@Module({
  controllers: [BotWebwhatsapController],
  providers: [BotWebwhatsapService]
})
export class BotWebwhatsapModule {}
