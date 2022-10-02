import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

import { AuthModule } from '../auth/auth.module';
import { Message } from './entities/message.entity';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [AuthModule, TypeOrmModule.forFeature([Message])],
  exports: [TypeOrmModule],
})
export class MessagesModule {}
