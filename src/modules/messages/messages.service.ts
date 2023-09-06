import { Injectable, Logger } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
  // NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Client } from 'whatsapp-web.js';

// import { PaginationDTO } from '../common/dto/pagination.dto';
// import { User } from '../auth/entities/user.entity';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto';
// import { TypeMessage } from './entities/typeMessage.entity';
// import { Category, TypeCategory } from './entities/category.entity';
// import { initialData } from '../seed/data/initialData';
import { Contact } from '../contacts/entities/contact.entity';
import { SendMessageDto } from '../webhook/dto';

@Injectable()
export class MessagesService {
  //#region variables
  private readonly logger = new Logger('MessagesService');
  // #defaultMsgs: CreateMessageDto[] = initialData.messages;

  //#endregion variables

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) {}

  async create(
    createMessageDto: CreateMessageDto,
    // user: User,
    contact: Contact
  ) {
    try {
      // const category = { id: createMessageDto.category };
      const newMessage: Message = this.messageRepository.create({
        ...createMessageDto,
        contact,
        // user,
      });
      await this.messageRepository.save(newMessage);
      // delete newMessage.user;
      return { message: 'mensaje agregado', ...newMessage };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  // async default(user: User) {
  //   return this.#defaultMsgs.map(async (msg) => await this.create(msg, user));
  // }

  // async findAll(query: PaginationDTO, user: User) {
  //   const { limit = 10, offset = 0 } = query;
  //   try {
  //     const query = this.messageRepository.createQueryBuilder('messages');
  //     query
  //       .where({ user })
  //       .skip(offset)
  //       .take(limit)
  //       .leftJoinAndSelect('messages.category', 'category');

  //     const allmessages = await query.getMany();
  //     const data = allmessages.map((message) => {
  //       console.log(message);

  //       const { category, ...dataMessage } = message;

  //       return { ...dataMessage, category: category.description };
  //     });
  //     return { message: `This action returns all messages`, data };
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // async findOne(id: number, user: User) {
  //   const message = await this.messageRepository.findOne({
  //     where: { id },
  //   });

  //   if (!message) throw new NotFoundException('message not found');

  //   return { message: `This action returns a #${id} message`, data: message };
  // }

  // async update(id: number, updateMessageDto: UpdateMessageDto) {
  //   const category = { id: updateMessageDto.category || 0 };
  //   const msg = await this.messageRepository.preload({
  //     id,
  //     ...updateMessageDto,
  //     category,
  //   });
  //   if (!msg) throw new NotFoundException(`Message whit #${id} not found`);
  //   try {
  //     await this.messageRepository.save(msg);
  //     return { message: `This action updates a #${id} message`, data: msg };
  //   } catch (err) {
  //     this.handleExceptions(err);
  //   }
  // }

  // async remove(id: string, user: User) {
  //   const message = await this.messageRepository.delete(id);
  //   if (!message.affected)
  //     throw new NotFoundException(`not found task whit id: ${id}`);
  // }

  // async addCategory(category: TypeCategory) {
  //   try {
  //     const newCategory: Category = await this.categoryRepository.create({
  //       description: category,
  //     });
  //     await this.categoryRepository.save(newCategory);
  //     return { message: 'category created', newCategory };
  //   } catch (err) {
  //     this.handleExceptions(err);
  //   }
  // }

  // async getCategories() {
  //   return this.categoryRepository.find();
  // }

  // #region methods
  sendMessage(
    client: Client,
    sendMessageDto: SendMessageDto
    // cellphone: string,
    // content: string | MessageMedia
  ) {
    const { cellphone, content } = sendMessageDto;
    try {
      client.sendMessage(cellphone, content);
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  // async #responseMessageByState(client: Client, msg: WAWebJS.Message) {
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

  //TODO: crear un handleExceptions global (serviceName:string, err:any)
  private handleExceptions(err: any): never {
    if (err.code === '23505') throw new BadRequestException(err.detail);

    this.logger.error(err);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs'
    );
  }

  // #endregion methods
}

// async createQuery(createQueryMessageDto: CreateQueryMessageDto, user: User) {
//   try {
//     const newMessage: Message = this.messageRepository.create({
//       ...createQueryMessageDto,
//       category: { id: createQueryMessageDto.category },
//       user,
//     });
//     await this.messageRepository.save(newMessage);
//     delete newMessage.user;
//     return { message: 'mensaje agregado', ...newMessage };
//   } catch (err) {
//     this.handleExceptions(err);
//   }
// }

// async findQueriesAll(query: PaginationDTO, user: User) {
//   const { limit = 10, offset = 0 } = query;
//   try {
//     const query = this.messageRepository.createQueryBuilder('messages');
//     query
//       .where({ user })
//       .skip(offset)
//       .take(limit)
//       .andWhere({ type: 3 })
//       .leftJoinAndSelect('messages.category', 'category')
//       .leftJoinAndSelect('messages.type', 'type');

//     const allqueries = await query.getMany();
//     return { message: `This action returns all queries`, data: allqueries };
//   } catch (err) {
//     console.log(err);
//   }
// }
// async getTypes() {
//   return this.typeMessageRepository.find();
// }
