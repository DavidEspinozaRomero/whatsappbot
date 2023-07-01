import { Controller } from '@nestjs/common';
// Get,
// Post,
// Body,
// Patch,
// Param,
// Delete,
import makeWASocket, { DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { WebhookService } from './webhook.service';
// import { CreateWebhookDto } from './dto/create-webhook.dto';
// import { UpdateWebhookDto } from './dto/update-webhook.dto';

// can provide additional config here
const sock = makeWASocket({ auth: null, printQRInTerminal: true });
@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {
    this.connectToWhatsApp();
  }

  connectToWhatsApp() {
    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === 'close') {
        const shouldReconnect =
          (lastDisconnect.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;
        console.log(
          'connection closed due to ',
          lastDisconnect.error,
          ', reconnecting ',
          shouldReconnect
        );
        // reconnect if not logged out
        if (shouldReconnect) {
          this.connectToWhatsApp();
        }
      } else if (connection === 'open') {
        console.log('opened connection');
      }
    });

    sock.ev.on('messages.upsert', async (m) => {
      console.log(JSON.stringify(m, undefined, 2));

      console.log('replying to', m.messages[0].key.remoteJid);
      await sock.sendMessage(m.messages[0].key.remoteJid!, {
        text: 'Hello there!',
      });
    });
  }

  // @Post()
  // create(@Body() createWebhookDto: CreateWebhookDto) {
  //   return this.webhookService.create(createWebhookDto);
  // }

  // @Get()
  // findAll() {
  //   return this.webhookService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.webhookService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWebhookDto: UpdateWebhookDto) {
  //   return this.webhookService.update(+id, updateWebhookDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.webhookService.remove(+id);
  // }
}
