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
import { Menu, PredefinedResponse } from '../responses';

// agregar usuario {user.id: { contact.id:'initial' }}
// states: intro | serviceOption(FAQs,Services,BOT,AGENTE)
// groupStates: open | close

@Injectable()
export class WebhookService {
  //#region variables
  private readonly logger = new Logger('ContactsService');
  private client!: WAWebJS.Client;

  private contactConversationState = {};
  private actionsMenu;

  // users {actionsMenu:{}, contactConversationState:{}}
  //#endregion variables

  constructor(
    private readonly contactService: ContactsService,
    private readonly messagesService: MessagesService,
    private readonly groupsService: GroupsService,
    private readonly responsesService: ResponsesService
  ) {
    this.#initializeWhatsApp();
  }

  //#region Whatsapp
  async #initializeWhatsApp() {
    this.client = await this.#createWhatsAppClient();
    try {
      this.client.on('authenticated', (session) => {
        console.log('authenticated', session);
      });

      this.client.on('ready', async () => {
        console.log('ready!');
        // agregar al objeto users el user
        // const contacts = await this.client.getContacts();
        // console.log(contacts);

        // this.client.getContactById()
      });

      this.client.on('group_join', async (args: any) => {
        console.log('group join');
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

  async #createWhatsAppClient() {
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
    console.log(rawMenu);

    switch (this.contactConversationState[contactDB.id]) {
      case ConversationState.start:
        try {
          const { id } =
            await this.responsesService.findOnePredefinedResponseByState(
              ConversationState.start
            );
          await this.#handleChat(contactDB.cellphone, id);

          const response = this.#buildMenuResponse(rawMenu);
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

          // TODO: crear funcion para distinguir cuando: crear un grupo/BOT/respuesta predefinida

          const optionsMenu = rawMenu.map((val) => val.order);
          if (!optionsMenu.includes(+body)) {
            this.sendMessage({
              cellphone: contactDB.cellphone,
              content:
                'Opción no válida. Por favor, escriba el "número" del menu de opciones',
            });
            return;
          }

          const { actionId, responseId } = this.#findOptionSelected(
            rawMenu,
            body
          );
          const selectedAction = this.actionsMenu[actionId];

          if (!selectedAction) {
            this.sendMessage({
              cellphone: contactDB.cellphone,
              content: `Error: esta opcion aun no esta funcionando`,
            });
            return;
          }

          switch (selectedAction) {
            case 'createGroup':
              // Lógica para la acción 'createGroup'
              console.log(
                `Realizando la acción 'createGroup' para el contacto {contactId} en la tienda {shop}`
              );
              try {
                this.contactConversationState[contactDB.id] = null;
                // let { groupName, description, groupMembers } =
                //   await this.groupsService.findOneGroup(responseId);

                const groupName = 'Soporte-' + randomUUID().split('-')[0];
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

                // const {}: ChatId = await this.client.getCommonGroups(gid)[0];
                // const actualChatGroup = await this.client.getChatById(actualgroup);
              } catch (err) {
                console.log(err);
              }
              break;

            case 'predefinedResponse':
              // Lógica para la acción 'predefinedResponse'
              try {
                this.#handleChat(contactDB.cellphone, responseId);
              } catch (err) {
                console.log(err);
              }

              break;

            case 'BOT':
              // Lógica para la acción 'BOT'
              console.log(
                `Realizando la acción 'BOT' para el contacto {contactId} en la tienda {shop}`
              );
              try {
                // const { content: prompt } =
                //   await this.responsesService.findOnePredefinedResponseById(
                //     responseId
                //   );


                this.contactConversationState[contactDB.id] =
                  ConversationState.process;
              } catch (err) {
                console.log(err);
              }
              break;

            default:
              console.log(
                'Opción no válida. Por favor, selecciona una opción válida.'
              );
              break;
          }

          // await this.handleAction(predefinedResponse, contactDB, contact);
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

  #buildMenuResponse(rawMenu: Menu[]): string {
    // Build the menu response based on the rawMenu data
    // Sort and format the menu options
    const formattedMenu = rawMenu
      .sort((a, b) => a.order - b.order)
      .map(({ order, content }) => `${order} ${content}`)
      .join('\n');
    return formattedMenu;
  }
  #findOptionSelected(rawMenu: Menu[], text: string) {
    // Extract the menu options (order) from the rawMenu data
    return rawMenu.find(({ order }) => order == +text);
  }
  async handleAction(contactDB: Contact, contact: WAWebJS.Contact) {
    this.actionsMenu ??= await this.getActions();

    console.log(this.actionsMenu, this.actionsMenu[actionId]);
  }

  async getActions() {
    const rawActions = await this.responsesService.findActions();

    const actions = {};
    rawActions.map(({ id, content }) => {
      actions[id] = content;
    });
    return actions;
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

// const actionsMenu = {
//   1: 'createGroup',
//   2: 'predefinedResponse',
//   3: 'BOT',
// }
// const conversationStates = {
//   start: 'start',
//   identify: 'identify',
//   process: 'process',
//   satisfaction: 'satisfaction',
//   end: 'end',
// }

// let shops = {
//   shop1: {

//     menu: {
//       1: 'Servicios',
//       2: 'Bot Soporte',
//       3: 'Agente',
//     },
//     contacts: {
//       contact1: { contactConversationState: undefined },
//       contact2: { contactConversationState: 'start' },
//       contact3: { contactConversationState: 'identify' },
//     },
//   },
//   shop2: {
//     conversationStates: {
//       start: 'start',
//       identify: 'identify',
//       process: 'process',
//       satisfaction: 'satisfaction',
//       end: 'end',
//     },
//     menu: {
//       1: 'Bot Soporte',
//       2: 'Agente',
//       3: 'Servicios',
//     },
//     contacts: {
//       contact1: { contactConversationState: 'start' },
//       contact2: { contactConversationState: 'identify' },
//       contact3: { contactConversationState: undefined },
//     },
//   },
// };
// let conversationState ??= conversationStates.start;

// function processInput(input) {

//   switch (contactConversationState) {
//     case conversationStates.start:
//       console.log('¡Hola! Soy un chatbot de atención al cliente.');
//       console.log("Para soporte técnico, escribe 'soporte'.");
//       console.log("Para consultas sobre facturación, escribe 'facturacion'.");
//       conversationState = conversationStates.identify;
//       break;

//     case conversationStates.identify:
//       console.log(
//         '¿En qué puedo ayudarte? Por favor, cuéntame más sobre tu consulta.'
//       );
//       conversationState = conversationStates.process;
//       break;

//     case conversationStates.process:
//       console.log('Procesando tu consulta...');
//       // Lógica de procesamiento aquí
//       console.log('Respuesta o acción proporcionada.');
//       conversationState = conversationStates.satisfaction;
//       break;

//     case conversationStates.satisfaction:
//       console.log('¿Fue útil la respuesta? (Sí/No)');
//       conversationState = conversationStates.end;
//       break;

//     case conversationStates.end:
//       console.log('¡Gracias por usar nuestro servicio! ¡Hasta luego!');
//       rl.close();
//       break;
//   }
// }

// rl.on('line', (input) => {
//   processInput(input.trim().toLowerCase());
// });
