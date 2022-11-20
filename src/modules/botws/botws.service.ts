import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import WAWebJS, { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import * as fs from 'fs';
import * as qr from 'qr-image';

import { User } from '../auth/entities/user.entity';
import { MessagesService } from '../messages/messages.service';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { Message } from '../messages/entities/message.entity';

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
    private readonly userRepository: Repository<User>,
    private readonly messagesService: MessagesService
  ) {}

  //#region methods

  async connectWhitWAW(sio: Socket, user: User) {
    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: './sessions/',
        clientId: user.id,
      }),
      puppeteer: { headless: true },
    });

    this.clientAuthenticated(this.client);
    this.clientReady(this.client, sio, user);
    this.clientQr(this.client, sio, user.id);
    this.clientDisconect();

    this.client.initialize();
  }

  private clientAuthenticated(client: Client) {
    client.on('authenticated', (session) => {
      console.log('authenticated', session);
    });
  }

  private listenMessages(client: Client, user: User): void {
    console.log('Listen!');
    client.on('message', async (msg) => {
      // const contact: WAWebJS.Contact = await msg.getContact();
      // const info = await msg.getInfo();
      const chat = await msg.getChat();

      console.log(chat.isGroup);

      // TODO: diferenciar cuando enviar mensajes

      if (chat.isGroup) {
        return;
      }

      // TODO: agregar un metodo para almacenamiento de media files
      // if (hasMedia) {
      //   console.log('hasMedia');

      //   // const media = await msg.downloadMedia();
      //   // do something with the media data here
      // }
      this.buildMessage(client, msg, user);
    });
  }

  private clientReady(client: Client, sio: Socket, user: User): void {
    client.on('ready', () => {
      this.listenMessages(client, user);
      const payload = {
        action: 'ready',
        description: 'Client is ready!',
      };
      sio.emit('message-from-server', payload);
    });
  }

  private clientQr(client: Client, sio: Socket, userId: string | number): void {
    this.client.on('qr', (qr) => {
      this.generateImage(qr, userId, () => {
        const payload = {
          action: 'download',
          description: 'download qrcode',
        };
        sio.emit('message-from-server', payload);
        setTimeout(() => {
          this.deleteFile('qr', `${userId}.svg`);
        }, 1000);
      });
      qrcode.generate(qr, { small: true }); // qr terminal
    });
  }

  private clientDisconect(): void {
    this.client.on('disconnected', () => {
      console.log('Client is disconnected!');
    });
  }

  private deleteFile(dir: string, pathFile: string) {
    const filePath = `${dir}/${pathFile}`;
    fs.unlinkSync(filePath);
  }

  getDBQuestionAnswer(user: User) {
    const query: PaginationDTO = { limit: 10, offset: 0 };
    return this.messagesService.findAll(query, user);
  }

  // TODO: agregar metodo para almacenar media
  // private storageMedia() {}

  // TODO: agregar metodo para diferenciar cuando enviar mensajes
  private async buildMessage(client: Client, msg: WAWebJS.Message, user: User) {
    const { from, to, body, reply, hasMedia } = msg;

    const { data } = await this.getDBQuestionAnswer(user);

    const now: string = new Date().toTimeString().split(' ')[0];

    const filterbytext = data.filter(
      ({ query }) => body.toLowerCase().includes(query.toLowerCase())
    );

    // TODO: mejorar el filtro por tiempo st 19:00 et 18:00 (solo 1 hora no se enviaria este mensaje de 18 a 19)
    const filterbytime = filterbytext.filter(
      ({ startTime, endTime }) => startTime <= now && now <= endTime
    );
    // TODO: agregar un filtro por categoria y tipo
    // TODO: agregar un tipo al mensage (texto/imagen/audio/url)
    // ({ query, answer, startTime, endTime })
    const find = filterbytime.find(
      ({ query }) => body.toLowerCase() == query.toLowerCase()
    );

    if (!find) {
      return;
    }
    const { answer } = find;

    setTimeout(() => {
      this.sendMessage(client, from, answer);
    }, 1000);

    // TODO: llamar a la api para responder segun el texto
    // if (body.toLowerCase().includes('link')) {
    //   this.sendMessage(client, from, 'https://youtu.be/6CwIB6pQoPo');
    //   return;
    // }
    // if (body.toLowerCase().includes('saludo')) {
    //   // texto
    //   // agregar un metodo para responder segun el texto
    //   const contact: WAWebJS.Contact = await msg.getContact();
    //   this.sendMessage(client, from, `Hello ${contact.shortName}`);
    //   return;
    // }
    // if (body.toLowerCase().includes('imagen')) {
    //   // img
    //   const DBresponse = 'img1.png';
    //   const media = MessageMedia.fromFilePath(`./media/${DBresponse}`);
    //   this.sendMessage(client, from, media);
    //   return;
    // }
    // if (body.toLowerCase().includes('audio')) {
    //   // audio
    //   const DBresponse = 'audio1.mp3';
    //   const media = MessageMedia.fromFilePath(`./media/${DBresponse}`);
    //   this.sendMessage(client, from, media);
    //   return;
    // }
    // if (body.toLowerCase().includes('url')) {
    //   // url
    //   const DBresponse = 'https://randomuser.me/api/portraits/women/0.jpg';
    //   const media = await MessageMedia.fromUrl(DBresponse);
    //   this.sendMessage(client, from, media);
    //   return;
    // }
  }

  filterByString(arr: []): [] {

    return []
  }
  // TODO: agregar metodo de reply

  private sendMessage(
    client: Client,
    to: string,
    message: string | WAWebJS.MessageMedia
  ): void {
    client.sendMessage(to, message);
  }

  private generateImage(
    base64: string,
    userId: string | number,
    cb: () => void
  ) {
    const qr_svg = qr.image(base64, { type: 'svg', margin: 4 });
    qr_svg.pipe(fs.createWriteStream(`qr/${userId}.svg`));
    cb();
  }

  //#endregion methods

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new Error('user not found');
    if (!user.isActive) throw new Error('user not active');
    this.checkUserConnection(user);
    this.conectedClients[client.id] = { socket: client, user };
    this.connectWhitWAW(client, user);
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
