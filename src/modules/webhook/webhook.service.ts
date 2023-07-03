import { Injectable, Logger } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common/exceptions';

import WAWebJS, { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import * as fs from 'fs';
import * as qr from 'qr-image';

import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { ContactsService } from '../contacts/contacts.service';
import { CreateMessageDto, MessagesService } from '../messages';
import { Contact } from '../contacts/entities/contact.entity';

@Injectable()
export class WebhookService {
  //#region variables
  private readonly logger = new Logger('ContactsService');
  //#endregion variables
  constructor(
    private readonly contactService: ContactsService,
    private readonly MessagesService: MessagesService
  ) {
    this.#conectWhitWhatsAppWeb();
  }

  //#region Whatsapp
  #conectWhitWhatsAppWeb() {
    const client = this.#createClient();

    try {
      client.on('authenticated', (session) => {
        console.log('authenticated', session);
      });

      client.on('ready', () => {
        console.log('ready!');
      });

      client.on('message', (msg: WAWebJS.Message) => {
        this.onMessage(msg);
      });

      client.on('qr', (qr) => {
        this.#generateImage(qr, 'userId', () => {
          setTimeout(() => {
            this.#deleteFile('qr', `${'userId'}.svg`);
          }, 5000);
        });
        // qrcode.generate(qr, { small: true }); // qr terminal
      });

      client.on('disconnected', () => {
        client.destroy();
        console.log('Client is disconnected!');
      });

      client.initialize();
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  #createClient() {
    try {
      const client = new Client({
        authStrategy: new LocalAuth({
          dataPath: './sessions/',
          clientId: 'test',
        }),
        puppeteer: { headless: true },
      });

      return client;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  //#endregion Whatsapp

  //#region Methods
  // TODO: agregar metodo para almacenar media
  // #storageMedia() {}

  // TODO: agregar metodo para diferenciar cuando enviar mensajes
  async onMessage(msg: WAWebJS.Message) {
    const { from, to, body, hasMedia } = msg;

    try {
      const contact: WAWebJS.Contact = await msg.getContact();
      const { pushname, isBusiness, isEnterprise, isBlocked } = contact;
      const formatedNumber = await contact.getFormattedNumber();

      const contactDB = await this.#checkContact(formatedNumber, pushname);

      this.#saveMessage(
        {
          content: body,
          hasMedia,
          send_at: new Date(),
        },
        contactDB
      );

      // if (hasMedia) await this.#recordMedia(msg);

      // TODO: diferenciar cuando responder al mensaje
      // if (!user.hasPaid || chat.isGroup) return;

      // await contact.getFormattedNumber() // +593 987 98 98 654
      // await contact.getCountryCode() // 593
      // const info: WAWebJS.MessageInfo = await msg.getInfo();
      // const chat:WAWebJS.Chat = await msg.getChat();

      // console.log( {from, body, hasMedia} );
    } catch (err) {
      this.handleExceptions(err);
    }
  }
  async #checkContact(formatedNumber: string, username: string) {
    let contact = await this.contactService.findOneByPhone(formatedNumber);

    // check and create contact
    if (!contact) {
      contact = await this.contactService.create({
        cellphone: formatedNumber,
        created_at: new Date(),
        last_seen: new Date(),
        username,
      });
    } else {
      await this.contactService.updateLastSeen({
        ...contact,
        last_seen: new Date(),
      });
    }
    return contact;
  }
  #saveMessage(data: CreateMessageDto, contact: Contact) {
    this.MessagesService.create(data, contact);
  }

  async #responseMessage(client: Client, msg: WAWebJS.Message) {
    const { from, to, body, reply, hasMedia } = msg;

    // let { data } = await this.getDBQuestionAnswer(user);

    // const now: string = new Date().toTimeString().split(' ')[0];
    // data = this.filterByString(data, body);
    // data = this.filterByTime(data, now);
    // data = this.filterByType(data);
    // data = this.filterByCategory(data);

    // TODO: agregar un tipo al mensage (texto/imagen/audio/url)
    // const find = data.find(({ keywords }) =>
    //   keywords.includes(body.toLowerCase())
    // );

    // if (!find) return;

    // const { answer } = find;

    // this.sendMessage(client, from, answer);

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
    // this.sendMessage(client, from, media);
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
  async #recordMedia(msg: WAWebJS.Message) {
    const media = await msg.downloadMedia();
    // do something with the media data here
    return '';
  }
  #generateImage(base64: string, userId: string, cb: () => void) {
    const qr_svg = qr.image(base64, { type: 'svg', margin: 4 });
    qr_svg.pipe(fs.createWriteStream(`qr/${userId}.svg`));
    cb();
  }
  #deleteFile(dir: string, pathFile: string) {
    const filePath = `${dir}/${pathFile}`;
    fs.unlinkSync(filePath);
  }

  //#endregion Methods

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

  handleExceptions(err: any): never {
    if (err.code === '23505') throw new BadRequestException(err.detail);

    this.logger.error(err);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs'
    );
  }
}
