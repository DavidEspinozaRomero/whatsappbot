import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { ContactsService } from '../contacts/contacts.service';
import { ContactsModule } from '../contacts/contacts.module';

@Module({
  controllers: [WebhookController],
  imports: [ContactsModule],
  providers: [WebhookService, ContactsService],
})
export class WebhookModule {}
