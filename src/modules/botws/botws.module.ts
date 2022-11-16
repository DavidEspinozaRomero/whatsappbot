import { Module } from '@nestjs/common';
import { BotwsService } from './botws.service';
import { BotwsGateway } from './botws.gateway';
import { AuthModule } from '../auth/auth.module';
import { MessagesModule } from '../messages/messages.module';
import { MessagesService } from '../messages/messages.service';

@Module({
  providers: [BotwsGateway, BotwsService, MessagesService],
  imports: [AuthModule, MessagesModule]
})
export class BotwsModule {}
