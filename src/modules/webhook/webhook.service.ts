import { Injectable } from '@nestjs/common';

import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';

@Injectable()
export class WebhookService {
  constructor() {
    const client = new Client({
      authStrategy: new LocalAuth({
        dataPath: './sessions/',
        clientId: 'test',
      }),
      puppeteer: { headless: true },
    });

    client.on('qr', (qr) => {
      console.log('QR RECEIVED', qr);
      qrcode.generate(qr, { small: true });
      console.log('qr end');
    });

    client.on('ready', () => {
      console.log('Client is ready!');
    });

    client.on('message', (message) => {
      console.log(message.body);
      message.reply('pong');
    });

    client.initialize();
  }
  create(createWebhookDto: CreateWebhookDto) {
    return 'This action adds a new webhook';
  }

  findAll() {
    return `This action returns all webhook`;
  }

  findOne(id: number) {
    return `This action returns a #${id} webhook`;
  }

  update(id: number, updateWebhookDto: UpdateWebhookDto) {
    return `This action updates a #${id} webhook`;
  }

  remove(id: number) {
    return `This action removes a #${id} webhook`;
  }
}
