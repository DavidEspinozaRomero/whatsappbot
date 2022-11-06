import { Module } from '@nestjs/common';

import { BotWebwhatsapService } from './bot-webwhatsap.service';
import { BotWebwhatsapController } from './bot-webwhatsap.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [BotWebwhatsapController],
  providers: [BotWebwhatsapService],
  imports: [AuthModule]
})
export class BotWebwhatsapModule {}
