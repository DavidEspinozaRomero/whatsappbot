import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { ContactsService } from '../contacts/contacts.service';
import { ContactsModule } from '../contacts/contacts.module';
import { MessagesModule, MessagesService } from '../messages';

@Module({
  controllers: [WebhookController],
  imports: [ContactsModule, MessagesModule],
  providers: [WebhookService, ContactsService, MessagesService],
})
export class WebhookModule {}
