import { Injectable } from '@nestjs/common';
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

export const FORMATDATE = 'dd-MM-YYYY hh:mm';

@Injectable()
export class BotWebwhatsapService {
  client: Client;
  sessionData: ClientSession;

  private readonly SESSION_FILE_PATH: string = './session.json';

  // constructor() {}
  connect() {
    const client = new Client({});

    client.on('qr', (qr) => {
      console.log('QR RECEIVED', qr);
      qrcode.generate(qr, {small: true}); // qr terminal
    });

    client.on('ready', () => {
      console.log('Client is ready!');
    });

    client.initialize();

    return { messsage: 'conected' };
  }

  qrcode() {
    // fs.existsSync(this.SESSION_FILE_PATH)
    //   ? this.whitSession()
    //   : this.whitOutSession();
    this.whitOutSession();

    this.authFail();
    this.clientReady();

    this.client.initialize();

    const file = fs.createReadStream(join(process.cwd(), 'qr/i_love_qr.svg'));
    return new StreamableFile(file);
  }

  //#region methods
  private async whitSession() {
    console.log('whitSession');
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: { headless: true },
    });

    this.authFail();
  }

  private async whitOutSession() {
    console.log('whitOutSession');

    this.client = new Client({});
    this.client.on('qr', (qr) => {
      this.generateImage(qr);
      qrcode.generate(qr, { small: true });
    });

    this.client.on('authenticated', (session) => {
      this.sessionData = session;
      // TODO: guardar la session
      console.log(session);
    });
  }

  private generateImage(base64: string) {
    const qr_svg = qr.image(base64, { type: 'svg', margin: 4 });
    qr_svg.pipe(fs.createWriteStream('qr/i_love_qr.svg'));
  }

  // private generateImage(base64: string) {
  //   const qr_img = qr.image(base64, { type: 'svg', margin: 4 });
  //   qr_img.pipe(fs.createWriteStream('mediaSend/qr-code.svg'));
  //   // console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡'`);
  //   // console.log(`⚡ Actualiza F5 el navegador para mantener el mejor QR⚡`);
  //   // cb()
  // }
  private authFail() {
    this.client.on('auth_failure', (err) => {
      console.log(err);
    });
  }
  private clientReady() {
    this.client.on('ready', () => {
      console.log('Client is ready!');
      this.listenMessages();
    });
  }

  private listenMessages() {
    this.client.on('message', (msg) => {
      console.log(msg);
      const { from, to, body, reply } = msg;
      // this.historyMesages()
      this.sendMessage(from, 'test mensage');
      this.replyMessage(reply, 'mensaje respuesta');
    });
  }

  private sendMedia(to: string, file: string) {
    const mediaFile = MessageMedia.fromFilePath(`./media/${file}`);
    this.client.sendMessage(to, mediaFile);
  }

  private sendMessage(to: string, message: string) {
    this.client.sendMessage(to, message);
  }
  private replyMessage(reply: ReplyMethod, message: string) {
    reply(message);
  }

  private historyMesages(number: string, message: string) {
    // TODO: guardar en base
    const today = moment().format(FORMATDATE);
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

//#region interface
interface ReplyMethod {
  (
    content: WAWebJS.MessageContent,
    chatId?: string,
    options?: WAWebJS.MessageSendOptions
  ): Promise<WAWebJS.Message>;
}
//#endregion interface

// Message {
//   _data: {
//     id: {
//       fromMe: false,
//       remote: '593992118720@c.us',
//       id: '3EB0266581CC83F055F1',
//       _serialized: 'false_593992118720@c.us_3EB0266581CC83F055F1'
//     },
//     body: 'jola mundo',
//     type: 'chat',
//     t: 1661995241,
//     notifyName: 'Lilia',
//     from: '593992118720@c.us',
//     to: '593939384904@c.us',
//     self: 'in',
//     ack: 1,
//     isNewMsg: true,
//     star: false,
//     kicNotified: false,
//     recvFresh: true,
//     isFromTemplate: false,
//     pollInvalidated: false,
//     broadcast: false,
//     mentionedJidList: [],
//     isVcardOverMmsDocument: false,
//     isForwarded: false,
//     hasReaction: false,
//     ephemeralOutOfSync: false,
//     productHeaderImageRejected: false,
//     lastPlaybackProgress: 0,
//     isDynamicReplyButtonsMsg: false,
//     isMdHistoryMsg: false,
//     requiresDirectConnection: false,
//     pttForwardedFeaturesEnabled: true,
//     isEphemeral: false,
//     isStatusV3: false,
//     links: []
//   },
//   mediaKey: undefined,
//   id: {
//     fromMe: false,
//     remote: '593992118720@c.us',
//     id: '3EB0266581CC83F055F1',
//     _serialized: 'false_593992118720@c.us_3EB0266581CC83F055F1'
//   },
//   ack: 1,
//   hasMedia: false,
//   body: 'jola mundo',
//   type: 'chat',
//   timestamp: 1661995241,
//   from: '593992118720@c.us',
//   to: '593939384904@c.us',
//   author: undefined,
//   deviceType: 'web',
//   isForwarded: false,
//   forwardingScore: 0,
//   isStatus: false,
//   isStarred: false,
//   broadcast: false,
//   fromMe: false,
//   hasQuotedMsg: false,
//   duration: undefined,
//   location: undefined,
//   vCards: [],
//   inviteV4: undefined,
//   mentionedIds: [],
//   orderId: undefined,
//   token: undefined,
//   isGif: false,
//   isEphemeral: false,
//   links: []
// }
