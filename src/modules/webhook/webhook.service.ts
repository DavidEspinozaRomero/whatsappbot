import { Injectable, Logger } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common/exceptions';

import WAWebJS, { Client, LocalAuth } from 'whatsapp-web.js';
// import * as qrcode from 'qrcode-terminal';
import * as fs from 'fs';
import * as qr from 'qr-image';

import { ContactsService } from '../contacts/contacts.service';
import { CreateMessageDto, MessagesService } from '../messages';
import { Contact } from '../contacts/entities/contact.entity';
import { SendMessageDto, SendMessageToContactDto } from './dto';
import { randomUUID } from 'crypto';
import { GroupsService } from '../groups/groups.service';
import { Group } from '../groups/entities';
import { ResponsesService } from '../responses/responses.service';

@Injectable()
export class WebhookService {
  //#region variables
  private readonly logger = new Logger('ContactsService');
  client!: WAWebJS.Client;
  stateContact = {};
  //#endregion variables

  constructor(
    private readonly contactService: ContactsService,
    private readonly messagesService: MessagesService,
    private readonly groupsService: GroupsService,
    private readonly responsesService: ResponsesService
  ) {
    this.#conectWhitWhatsAppWeb();
  }

  //#region Whatsapp
  #conectWhitWhatsAppWeb() {
    this.client = this.#createClient();

    try {
      this.client.on('authenticated', (session) => {
        console.log('authenticated', session);
      });

      this.client.on('ready', async () => {
        console.log('ready!');
      });

      this.client.on('message', (msg: WAWebJS.Message) => {
        this.handleMessage(msg);
      });

      this.client.on('qr', (qr) => {
        this.#generateImage(qr, 'userId', () => {
          setTimeout(() => {
            this.#deleteFile('qr', `${'userId'}.svg`);
          }, 5000);
        });
        // qrcode.generate(qr, { small: true }); // qr terminal
      });

      this.client.on('disconnected', () => {
        this.client.destroy();
        console.log('Client is disconnected!');
      });

      this.client.initialize();
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
  async handleMessage(msg: WAWebJS.Message) {
    const { from, body, hasMedia, fromMe, deviceType, type, broadcast } = msg;

    // const info:WAWebJS.MessageInfo = await msg.getInfo();
    if (broadcast || from == 'status@broadcast') return;

    const contact: WAWebJS.Contact = await msg.getContact();
    const { verifiedName, pushname, isBlocked, isBusiness, isEnterprise } =
      contact;

    try {
      // save/update contact
      const [contactDB, isNewContact] = await this.#checkContact(
        from,
        verifiedName ?? pushname,
        isBlocked,
        isBusiness,
        isEnterprise
      );

      //save messages in DB
      // TODO: voiceToText api
      // if (hasMedia) await this.#recordMedia(msg);
      this.#saveMessage(
        {
          content: body,
          hasMedia,
          fromMe,
          deviceType,
          type,
          send_at: new Date(),
        },
        contactDB
      );

      // TODO: diferenciar cuando responder al mensaje
      // if (!user.hasPaid) return;
      const { isGroup } = await msg.getChat();
      if (isBlocked || fromMe || isGroup) return;
      console.log(body);

      // TODO: check the stage of contact/client
      if (isNewContact) {
        this.#handleNewContactChat(contactDB.cellphone);
      } else {
        // TODO: Create a flow for the message welcome -> menu selection -> bucle -> welcome
        this.#handleContactChat(contactDB.cellphone);

        this.stateContact[contactDB.id] = 0;

        if (this.stateContact[contactDB.id]) return;
        switch (this.stateContact[contactDB.id]) {
          case 1:
            const { content } =
              await this.responsesService.findOnePredefinedResponseByType(
                'FAQs'
              );
            content.forEach((text) => {
              this.sendMessage({
                cellphone: contactDB.cellphone,
                content: text,
              });
            });
            break;
          case body == 'AGENTE':
            const groupName = 'Soporte Técnico ' + randomUUID().split('-')[0];
            const { gid } = await this.#createGroupWhit(groupName, contact);
            const group = this.groupsService.findOneGroup(+gid);
            // const groupManagement = this.groupsService.findOneGroupManagement(+gid);

            let newGroup: Group;
            // let newGroupManagement: GroupManagement;
            if (!group) {
              newGroup = await this.groupsService.createGroup({
                id: +gid,
                description: 'agente',
                groupMembers: [contactDB.id],
                groupName,
              });

              // newGroupManagement =
              await this.groupsService.createGroupManagement(
                {
                  permissions: 'all',
                  status: 'active',
                  role: 'admin',
                  lastSeen: new Date(),
                },
                newGroup
              );
            }
            // const {}: ChatId = await this.client.getCommonGroups(gid)[0];
            // const actualChatGroup = await this.client.getChatById(actualgroup);
            // actualChatGroup.
            break;

          // case val:
          //   break;
          // case val:
          //   break;

          default:
            break;
        }
      }

      // const responses = await this.responsesService.findAllPredefinedResponse();
      // responses.at(-1)
      // responses.forEach((response) => {
      //   if (response.responseType === 'text') {
      //     response.content.forEach((text) => {
      //       this.sendMessage({
      //         cellphone: contactDB.cellphone,
      //         content: text,
      //       });
      //     });
      //   }
      // });
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async #handleNewContactChat(cellphone: string) {
    const { content: welcome } =
      await this.responsesService.findOnePredefinedResponseByType('welcome');
    welcome.forEach((text) => {
      this.sendMessage({
        cellphone,
        content: text,
      });
    });
    const { content } =
      await this.responsesService.findOnePredefinedResponseByType('menu');
    const response = content.reduce((acc = '', text, index) => {
      acc += `${index + 1} ${text} `;
      // ${content.length == index + 1 ? '' : '%0A'}
      return acc;
    });
    this.sendMessage({
      cellphone,
      content: response,
    });
  }
  async #handleContactChat(cellphone: string) {
    const { content: welcome } =
      await this.responsesService.findOnePredefinedResponseByType('rewelcome');
    welcome.forEach((text) => {
      this.sendMessage({
        cellphone,
        content: text,
      });
    });
    const { content } =
      await this.responsesService.findOnePredefinedResponseByType('menu');
    const response = content.reduce((acc, text, index) => {
      acc += `${index + 1} ${text} `;
      return acc;
    });
    this.sendMessage({
      cellphone,
      content: response,
    });
  }
  // #handleGroupChat(cellphone: string) {
  //   // TODO: check if the contact has an active group support/financial/etc, its state
  //   this.sendMessage({
  //     cellphone,
  //     content: 'Welcome to bussinessName!',
  //   });
  //   // agregar menu inicial
  // }

  #checkContact(
    WACellphone: string,
    username: string,
    isBlocked: boolean,
    isBusiness: boolean,
    isEnterprise: boolean
  ) {
    return this.contactService.checkContact(
      WACellphone,
      username,
      isBlocked,
      isBusiness,
      isEnterprise
    );
  }
  #saveMessage(data: CreateMessageDto, contact: Contact) {
    this.messagesService.create(data, contact);
  }

  async #createGroupWhit(groupName: string, contact: WAWebJS.Contact) {
    return await this.client.createGroup(groupName, [contact]);
  }

  // async #responseMessage(client: Client, msg: WAWebJS.Message) {
  //   // const { from, to, body, reply, hasMedia } = msg;
  //   // let { data } = await this.getDBQuestionAnswer(user);
  //   // const now: string = new Date().toTimeString().split(' ')[0];
  //   // data = this.filterByString(data, body);
  //   // data = this.filterByTime(data, now);
  //   // data = this.filterByType(data);
  //   // data = this.filterByCategory(data);
  //   // TODO: agregar un tipo al mensage (texto/imagen/audio/url)
  //   // const find = data.find(({ keywords }) =>
  //   //   keywords.includes(body.toLowerCase())
  //   // );
  //   // if (!find) return;
  //   // const { answer } = find;
  //   // this.sendMessage(client, from, answer);
  //   // TODO: llamar a la api para responder segun el texto
  //   // if (body.toLowerCase().includes('link')) {
  //   //   this.sendMessage(client, from, 'https://youtu.be/6CwIB6pQoPo');
  //   //   return;
  //   // }
  //   // if (body.toLowerCase().includes('saludo')) {
  //   //   // texto
  //   //   // agregar un metodo para responder segun el texto
  //   //   const contact: WAWebJS.Contact = await msg.getContact();
  //   //   this.sendMessage(client, from, `Hello ${contact.shortName}`);
  //   //   return;
  //   // }
  //   // if (body.toLowerCase().includes('imagen')) {
  //   //   // img
  //   //   const DBresponse = 'img1.png';
  //   //   const media = MessageMedia.fromFilePath(`./media/${DBresponse}`);
  //   //   this.sendMessage(client, from, media);
  //   //   return;
  //   // }
  //   // if (body.toLowerCase().includes('audio')) {
  //   //   // audio
  //   //   const DBresponse = 'audio1.mp3';
  //   //   const media = MessageMedia.fromFilePath(`./media/${DBresponse}`);
  //   // this.sendMessage(client, from, media);
  //   //   return;
  //   // }
  //   // if (body.toLowerCase().includes('url')) {
  //   //   // url
  //   //   const DBresponse = 'https://randomuser.me/api/portraits/women/0.jpg';
  //   //   const media = await MessageMedia.fromUrl(DBresponse);
  //   //   this.sendMessage(client, from, media);
  //   //   return;
  //   // }
  // }
  // async #recordMedia(msg: WAWebJS.Message) {
  //   const media = await msg.downloadMedia();
  //   // do something with the media data here
  //   return '';
  // }
  #generateImage(base64: string, userId: string, cb: () => void) {
    const qr_svg = qr.image(base64, { type: 'svg', margin: 4 });
    qr_svg.pipe(fs.createWriteStream(`qr/${userId}.svg`));
    cb();
  }
  #deleteFile(dir: string, pathFile: string) {
    const filePath = `${dir}/${pathFile}`;
    fs.unlinkSync(filePath);
  }

  sendMessage(sendMessageDto: SendMessageDto) {
    this.messagesService.sendMessage(this.client, sendMessageDto);
  }

  async sendMessageToContact(sendMessageToContact: SendMessageToContactDto) {
    const { id, content } = sendMessageToContact;
    const { cellphone } = await this.contactService.findOne(id);

    this.messagesService.sendMessage(this.client, { cellphone, content });
  }

  //#endregion Methods

  // create(createWebhookDto: CreateWebhookDto) {
  //   return 'This action adds a new webhook';
  // }

  // findAll() {
  //   return `This action returns all webhook`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} webhook`;
  // }

  // update(id: number, updateWebhookDto: UpdateWebhookDto) {
  //   return `This action updates a #${id} webhook`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} webhook`;
  // }

  handleExceptions(err: any): never {
    if (err.code === '23505') throw new BadRequestException(err.detail);

    this.logger.error(err);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs'
    );
  }
}
