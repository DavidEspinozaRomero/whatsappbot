import { Injectable, Logger } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common/exceptions';

import WAWebJS, { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
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

// agregar usuario {user.id: { contact.id:'initial' }}
// states: intro | serviceOption(FAQs,Services,BOT,AGENTE)
// groupStates: open | close

@Injectable()
export class WebhookService {
  //#region variables
  private readonly logger = new Logger('ContactsService');
  client!: WAWebJS.Client;
  stateContact = {};
  // users = new Set();
  // stateContact = new Map();
  // users = {
  //   // opt1
  //   user1: {
  //     states: [''],
  //     stateContact1: '',
  //     stateContact2: ''
  //   },
  //   // opt2
  //   user2: {
  //     states: [''],
  //     stateContact1: '',
  //     contact2: {
  //       state: '',
  //       groupState:''
  //     }
  //   },
  // };

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
  async #conectWhitWhatsAppWeb() {
    console.log('???');
    this.client = await this.#createClient();
    try {
      this.client.on('authenticated', (session) => {
        console.log('authenticated', session);
      });

      this.client.on('ready', async () => {
        console.log('ready!');
        // agregar al objeto users el user
      });

      this.client.on('group_join', async (args: WAWebJS.GroupChat) => {
        console.log('group join');
        args.sendMessage('test group message');
        console.log(args);
        // this.handleGroup(group);
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
        qrcode.generate(qr, { small: true }); // qr terminal
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

  async #createClient() {
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

    // TODO: diferenciar cuando responder al mensaje
    const contact: WAWebJS.Contact = await msg.getContact();
    const { verifiedName, pushname, isBlocked, isBusiness, isEnterprise } =
      contact;
    const { isGroup } = await msg.getChat();

    // if (!user.hasPaid) return;
    if (isBlocked || fromMe || isGroup) return;

    try {
      // save/update contact
      const contactDB = await this.#checkContact(
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

      // TODO: check the stage of contact/client
      this.stateContact[contactDB.id] ??= 'welcome';

      if (body == 'AGENTE') {
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

        return;
      }

      this.#handleChat(contactDB.cellphone, contactDB.id);

      // TODO: Create a flow for the message welcome -> menu selection -> bucle -> welcome
      // initial -> menuSelection -> initial/group
      // agregar usuario {user.id: { contact.id:'initial' }}
      // states: intro | serviceOption(FAQs,Services,BOT,AGENTE)
      // groupStates: open | close
    } catch (err) {
      this.handleExceptions(err);
    }
  }
  async #handleChat(cellphone: string, contactId: number) {
    // check state
    const state = this.stateContact[contactId];

    // TODO: add to the table next state if required
    const { content, nextResponse: nextState } =
      await this.responsesService.findOnePredefinedResponseByType(state);
    let response: string = '';
    if (state == 'menu') {
      response = content
        .map((text, index) => {
          return content.length > index + 1
            ? `${index + 1} ${text}`.concat('\n')
            : `${index + 1} ${text}`;
        })
        .join('');
    } else {
      response = content
        .map((text, index) => {
          return content.length > index + 1 ? text.concat('\n') : text;
        })
        .join('');
    }

    this.sendMessage({ cellphone, content: response });

    if (nextState) {
      this.stateContact[contactId] = nextState ;
      this.#handleChat(cellphone, contactId);
      return;
    }
    this.stateContact[contactId] = 'rewelcome';
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
