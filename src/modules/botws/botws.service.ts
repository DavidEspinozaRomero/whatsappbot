import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StreamableFile } from '@nestjs/common/file-stream/streamable-file';

import WAWebJS, {
  Client,
  ClientSession,
  LocalAuth,
  MessageMedia,
} from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import * as fs from 'fs';
import * as qr from 'qr-image';
import moment from 'moment';
import { join } from 'path';

import { User } from '../auth/entities/user.entity';
@Injectable()
export class BotwsService {
  private conectedClients: ConectedClients = {};
  client: Client;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  getqrcode(sio: Socket) {
    // this.client = new Client({
    //   authStrategy: new LocalAuth(),
    //   puppeteer: { headless: true },
    // });
    this.client = new Client({});

    this.client.on('authenticated', (session) => {
      console.log('authenticated', session);
    });

    this.client.on('message', (msg) => {
      console.log(msg);
      const { from, to, body, reply } = msg;
      this.client.sendMessage(from, 'Message');
      // msg.reply(from, 'Reply')
    });

    this.client.on('ready', () => {
      console.log('Client is ready!');
      sio.emit('message-from-server', {
        fullName: 'soy yo',
        message: 'client ready',
      });
    });

    this.client.on('qr', (qr) => {
      // console.log('QR RECEIVED', qr);
      this.generateImage(qr, () => {
        const file = fs.createReadStream(join(process.cwd(), 'qr/i_love_qr.svg'));
        sio.emit('message-from-server', {
          fullName: 'soy yo',
          message: 'qrcode',
          qr: file,
        });
      });
      qrcode.generate(qr, { small: true }); // qr terminal
    });

    this.client.on('disconnected', () => {
      console.log('Client is disconnected!');
    });

    this.client.initialize();
  }

  private generateImage(base64: string, cb: () => void) {
    const qr_svg = qr.image(base64, { type: 'svg', margin: 4 });
    qr_svg.pipe(fs.createWriteStream('qr/i_love_qr.svg'));
    cb();
  }

  private listenMessages(client: Client) {
    client.on('message', (msg) => {
      console.log(msg);
      const { from, to, body, reply } = msg;
      client.sendMessage(from, 'Message');
      // msg.reply(from, 'Reply')
    });
  }

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new Error('user not found');
    if (!user.isActive) throw new Error('user not active');
    this.checkUserConnection(user);
    this.conectedClients[client.id] = { socket: client, user };
  }

  removeClient(clientId: string) {
    delete this.conectedClients[clientId];
  }

  getClientsConected(): string[] {
    return Object.keys(this.conectedClients);
  }

  getUserFullName(socketId: string) {
    return this.conectedClients[socketId].user.fullName;
  }

  checkUserConnection(user: User) {
    for (const clientId of Object.keys(this.conectedClients)) {
      const conectedClient = this.conectedClients[clientId];

      if (conectedClient.user.id === user.id) {
        conectedClient.socket.disconnect();
        break;
      }
    }
  }
}

interface ConectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
    // mobile?: boolean;
    // descktop?: boolean;
  };
}
