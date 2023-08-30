import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { Message, ScheduledMessage } from './entities';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [TypeOrmModule.forFeature([Message, ScheduledMessage])],
  exports: [TypeOrmModule],
})
export class MessagesModule {}
