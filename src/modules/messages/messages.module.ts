import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
// import { TypeMessage } from './entities/typeMessage.entity';
// import { Category } from './entities/category.entity';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Message
      // , TypeMessage, Category
    ]),
  ],
  exports: [TypeOrmModule],
})
export class MessagesModule {}
