import { Module } from '@nestjs/common';

import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { ContactsService } from '../contacts/contacts.service';
import { ContactsModule } from '../contacts/contacts.module';
import { MessagesModule, MessagesService } from '../messages';
import { GroupsModule } from '../groups/groups.module';
import { ResponsesModule } from '../responses/responses.module';
import { GroupsService } from '../groups/groups.service';
import { ResponsesService } from '../responses/responses.service';

@Module({
  controllers: [WebhookController],
  imports: [ContactsModule, MessagesModule, GroupsModule, ResponsesModule],
  providers: [
    WebhookService,
    ContactsService,
    MessagesService,
    GroupsService,
    ResponsesService,
  ],
})
export class WebhookModule {}
