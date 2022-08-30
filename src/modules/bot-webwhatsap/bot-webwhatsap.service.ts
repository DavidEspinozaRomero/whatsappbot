import { Injectable } from '@nestjs/common';

import { Client, ClientSession } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import * as fs from 'fs';

@Injectable()
export class BotWebwhatsapService {
  client: Client;
  sessionData: ClientSession;

  private readonly SESSION_FILE_PATH: string = './session.json';

  // constructor() {}

  async qrcode() {
    this.client = new Client({});
    console.log(fs.existsSync(this.SESSION_FILE_PATH));

    fs.existsSync(this.SESSION_FILE_PATH)
      ? this.whitSession()
      : this.whitOutSession();

    // this.client.on('ready', () => {
    //   console.log('Client is ready!');
    // });

    // this.client.on('message', (msg) => {
    //   if (msg.body == 'ping') {
    //     this.client.sendMessage(msg.from, 'pong');
    //     // msg.reply('pong');
    //   }
    // });

    // await this.client.initialize();
    return { message: 'Client is ready!' };
  }

  //#region methods
  private whitSession() {
    console.log('whitSession');
  }

  private whitOutSession() {
    console.log('whitOutSession');
    this.client.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
    });

    this.client.on('authenticated', (session) => {
      this.sessionData = session;
      console.log(session);
      fs.writeFile(this.SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
          console.error(err);
        }
      });
    });

    this.client.initialize();
  }
  //#emdregion methods

  // create(createBotWebwhatsapDto: CreateBotWebwhatsapDto) {
  //   return 'This action adds a new botWebwhatsap';
  // }

  // findAll() {
  //   return `This action returns all botWebwhatsap`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} botWebwhatsap`;
  // }

  // update(id: number, updateBotWebwhatsapDto: UpdateBotWebwhatsapDto) {
  //   return `This action updates a #${id} botWebwhatsap`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} botWebwhatsap`;
  // }
}
