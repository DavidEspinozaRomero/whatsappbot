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
import { join } from 'path';

import { User } from '../auth/entities/user.entity';
@Injectable()
export class BotwsService {
  //#region
  //#endregion
  //#region variables
  private conectedClients: ConectedClients = {};
  client: Client;
  //#endregion variables

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  connectWhitWAW(sio: Socket) {
    this.client = new Client({
      // authStrategy: new LocalAuth({ dataPath: './sessions/', clientId: 'bot' }),
      authStrategy: new LocalAuth(),
      puppeteer: { headless: true },
    });

    this.clientAuthenticated(this.client);
    this.clientReady(this.client, sio);
    this.clientQr(this.client, sio);
    this.clientDisconect();

    this.client.initialize();
  }

  //#region methods

  private clientAuthenticated(client: Client) {
    client.on('authenticated', (session) => {
      console.log('authenticated', session);
    });
  }

  private listenMessages(client: Client): void {
    console.log('Listen!');
    client.on('message', async (msg) => {
      const contact: WAWebJS.Contact = await msg.getContact();
      console.log(contact);

      // TODO: agregar metodo para diferenciar cuando enviar mensajes

      if (contact.isGroup) {
        return
      }

      // console.log(msg);
      const { from, to, body, reply, hasMedia } = msg;
      // TODO: agregar un metodo para la media files
      if (hasMedia) {
        console.log('hasMedia');

        // const media = await msg.downloadMedia();
        // do something with the media data here
      }

      // this.sendMediaMessage(client, from, 'audio1.mp3');
      // this.sendMediaURL(client, from, 'https://randomuser.me/api/portraits/women/0.jpg');
      this.sendMessage(client, from, `Hello @${contact.shortName}`);
      // this.sendMessage(client, from, `Hello`);
      // TODO: agregar metodo de reply
      // msg.reply('test')
    });
  }

  private clientReady(client: Client, sio: Socket): void {
    client.on('ready', () => {
      console.log('Client is ready!');
      this.listenMessages(client);
      sio.emit('message-from-server', {
        fullName: 'soy yo',
        message: 'client ready',
      });
    });
  }

  private clientQr(client: Client, sio: Socket): void {
    this.client.on('qr', (qr) => {
      this.generateImage(qr, () => {
        const file = fs.createReadStream(
          join(process.cwd(), 'qr/i_love_qr.svg')
        );
        sio.emit('message-from-server', {
          fullName: 'soy yo',
          message: 'qrcode',
          qr: file,
        });
      });
      qrcode.generate(qr, { small: true }); // qr terminal
    });
  }

  private clientDisconect(): void {
    this.client.on('disconnected', () => {
      console.log('Client is disconnected!');
    });
  }

  

  private sendMessage(client: Client, to: string, message: string): void {
    client.sendMessage(to, message);
  }

  private sendMediaMessage(client: Client, to: string, filename: string): void {
    // TODO: agregar direccion de archivo variable
    const media = MessageMedia.fromFilePath(`./media/${filename}`);
    // const options: WAWebJS.MessageSendOptions;
    client.sendMessage(to, media, { sendAudioAsVoice: true });
  }

  private async sendMediaURL(
    client: Client,
    to: string,
    url: string
  ): Promise<void> {
    // TODO: agregar direccion de archivo variable
    const media = await MessageMedia.fromUrl(url);
    // const options: WAWebJS.MessageSendOptions;
    client.sendMessage(to, media);
  }

  private generateImage(base64: string, cb: () => void) {
    const qr_svg = qr.image(base64, { type: 'svg', margin: 4 });
    qr_svg.pipe(fs.createWriteStream('qr/i_love_qr.svg'));
    cb();
  }

  //#endregion methods

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

//#region interfaces
interface ConectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
    // mobile?: boolean;
    // descktop?: boolean;
  };
}
//#endregion interfaces
