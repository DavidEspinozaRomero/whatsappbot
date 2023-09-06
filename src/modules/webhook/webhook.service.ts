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
import { ConversationState, ActionMenu } from './interfaces';
import { PredefinedResponse } from '../responses';

// agregar usuario {user.id: { contact.id:'initial' }}
// states: intro | serviceOption(FAQs,Services,BOT,AGENTE)
// groupStates: open | close

@Injectable()
export class WebhookService {
  //#region variables
  private readonly logger = new Logger('ContactsService');
  client!: WAWebJS.Client;
  // conversationStates = ['start', 'identify', 'process', 'satisfaction', 'end'];
  // actions = ['createGroup', 'predefinedResponse', 'BOT']
  contactConversationState = {};

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

    try {
      // TODO: diferenciar cuando responder al mensaje
      const contact: WAWebJS.Contact = await msg.getContact();
      const { verifiedName, pushname, isBlocked, isBusiness, isEnterprise } =
        contact;
      const { isGroup } = await msg.getChat();

      // if (!user.hasPaid) return;
      if (isBlocked || fromMe || isGroup) return;

      // save/update contact
      const contactDB = await this.#checkContact(
        from,
        verifiedName ?? pushname,
        isBlocked,
        isBusiness,
        isEnterprise
      );

      // TODO: voiceToText api
      // if (hasMedia) await this.#recordMedia(msg);

      //save messages in DB
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

      // check the stage of contact/client
      this.contactConversationState[contactDB.id] ??= ConversationState.start;
      console.log(this.contactConversationState[contactDB.id]);
      this.#chatFlow(contactDB, body, contact);
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async #chatFlow(contactDB: Contact, body: string, contact: WAWebJS.Contact) {
    const rawMenu = await this.responsesService.findMenu();

    switch (this.contactConversationState[contactDB.id]) {
      case ConversationState.start:
        try {
          const { id } =
            await this.responsesService.findOnePredefinedResponseByState(
              ConversationState.start
            );
          await this.#handleChat(contactDB.cellphone, id);

          const response = rawMenu
            .map(({ order, content }) => `${order} ${content}`)
            .join('\n');

          this.sendMessage({
            cellphone: contactDB.cellphone,
            content: response,
          });

          this.contactConversationState[contactDB.id] =
            ConversationState.identify;
        } catch (err) {
          console.log(err);
        }
        break;

      // la persona ingresa una opcion del menu o no
      case ConversationState.identify:
        try {
          // TODO: crear funcion para distinguir cuando: crear un grupo/BOT/respuesta predefinida

          // obtener el menu de opciones

          const optionsMenu = rawMenu.map((option) => {
            return option.order;
          });
          console.log(rawMenu);

          if (!optionsMenu.includes(+body)) {
            this.sendMessage({
              cellphone: contactDB.cellphone,
              content: 'Porfavor escriba el número del menu de opciones',
            });
            return;
          }

          const { idPredefinedResponse } = rawMenu.find(
            (res) => res.order == +body
          );

          await this.handleAction(idPredefinedResponse, contactDB, contact);
        } catch (err) {
          console.log(err);
        }
        break;

      case ConversationState.process:
        try {
          // se queda en esta fase hasta a ver solucionado la pregunta
          // console.log('Procesando tu consulta...');

          // Lógica de procesamiento aquí
          // agregar el BOT

          // console.log('Respuesta o acción proporcionada.');

          // crear bucle hasta satisfacer la necesidad
          this.contactConversationState[contactDB.id] =
            ConversationState.satisfaction;
        } catch (err) {
          console.log(err);
        }

        break;

      case ConversationState.satisfaction:
        try {
          // console.log('¿Fue útil la respuesta? (Sí/No)');
          this.contactConversationState[contactDB.id] = ConversationState.end;
        } catch (err) {
          console.log(err);
        }
        break;

      case ConversationState.end:
        try {
          // console.log('¡Gracias por usar nuestro servicio! ¡Hasta luego!');
          this.contactConversationState[contactDB.id] = null;
        } catch (err) {
          console.log(err);
        }
        break;
    }
  }
  async handleAction(
    predefined: PredefinedResponse,
    contactDB: Contact,
    contact: WAWebJS.Contact
  ) {
    const { actionType, id } = predefined;
    const { content: action } = actionType;
    switch (true) {
      case ActionMenu.createGroup == action:
        // crea un grupo
        // if (body == 'AGENTE') {
        this.contactConversationState[contactDB.id] = null;
        const groupName = 'Soporte Técnico ' + randomUUID().split('-')[0];
        const { gid } = await this.#createGroupWhit(groupName, contact);
        const group = this.groupsService.findOneGroup(+gid);

        let newGroup: Group;
        if (!group) {
          newGroup = await this.groupsService.createGroup({
            id: +gid,
            description: 'agente',
            groupMembers: [contactDB.id],
            groupName,
          });

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
        return;
        //   // const {}: ChatId = await this.client.getCommonGroups(gid)[0];
        //   // const actualChatGroup = await this.client.getChatById(actualgroup);
        // }
        break;

      case ActionMenu.response == action:
        // const { id } =
        //   await this.responsesService.findOnePredefinedResponseByState();
        this.#handleChat(contactDB.cellphone, id);
        break;

      case ActionMenu.BOT == action:
        // console.log('¿En qué puedo ayudarte? Por favor, cuéntame más sobre tu consulta.');
        this.contactConversationState[contactDB.id] = ConversationState.process;
        break;

      default:
        break;
    }
  }

  async #handleChat(cellphone: string, responseId: number) {
    const { content, nextResponse } =
      await this.responsesService.findOnePredefinedResponseById(responseId);
    // const response: string = !isNaN(+content[0])
    //   ? content.replaceAll(',', ' ')
    //   : content;

    this.sendMessage({ cellphone, content });

    if (nextResponse) {
      this.#handleChat(cellphone, nextResponse);
      return;
    }
    // this.stateContact[contactId] = null;
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

// import { createInterface } from 'node:readline';

// const rl = createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// let conversationState = 'start';

// function processInput(input) {
//   switch (conversationState) {
//     case 'start':
//       console.log('¡Hola! Soy un chatbot de atención al cliente.');
//       console.log("Para soporte técnico, escribe 'soporte'.");
//       console.log("Para consultas sobre facturación, escribe 'facturacion'.");
//       conversationState = 'identify';
//       break;

//     case 'identify':
//       console.log(
//         '¿En qué puedo ayudarte? Por favor, cuéntame más sobre tu consulta.'
//       );
//       conversationState = 'process';
//       break;

//     case 'process':
//       console.log('Procesando tu consulta...');
//       // Lógica de procesamiento aquí
//       console.log('Respuesta o acción proporcionada.');
//       conversationState = 'satisfaction';
//       break;

//     case 'satisfaction':
//       console.log('¿Fue útil la respuesta? (Sí/No)');
//       conversationState = 'end';
//       break;

//     case 'end':
//       console.log('¡Gracias por usar nuestro servicio! ¡Hasta luego!');
//       rl.close();
//       break;
//   }
// }

// rl.on('line', (input) => {
//   processInput(input.trim().toLowerCase());
// });
