import { Injectable, Logger } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';

import { Between, Repository } from 'typeorm';
import { Client } from 'whatsapp-web.js';

// import { PaginationDTO } from '../common/dto/pagination.dto';
// import { User } from '../auth/entities/user.entity';
import { Message } from './entities/message.entity';
import { CreateMessageDto, UpdateScheduledMessageDto } from './dto';
// import { TypeMessage } from './entities/typeMessage.entity';
// import { Category, TypeCategory } from './entities/category.entity';
// import { initialData } from '../seed/data/initialData';
import { Contact } from '../contacts/entities/contact.entity';
import { SendMessageDto } from '../webhook/dto';
import { CreateScheduledMessageDto } from './dto/create-scheduled-message.dto';
import { ScheduledMessage } from './entities';

@Injectable()
export class MessagesService {
  //#region variables
  private readonly logger = new Logger('MessagesService');
  // #defaultMsgs: CreateMessageDto[] = initialData.messages;

  //#endregion variables

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(ScheduledMessage)
    private readonly scheduledMessageRepository: Repository<ScheduledMessage>
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

  async createScheduledMessage(
    createScheduledMessageDto: CreateScheduledMessageDto
  ) {
    try {
      const newScheduledMessage = this.scheduledMessageRepository.create(
        createScheduledMessageDto
      );
      await this.scheduledMessageRepository.save(newScheduledMessage);

      return {
        message: 'Created scheduled message',
        ...newScheduledMessage,
      };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async findAll() {
    try {
      const scheduledMessages = await this.scheduledMessageRepository.findBy(
        {}
      );
      return scheduledMessages;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async findAllByTimeRange(startTime: Date, endTime: Date) {
    try {
      const scheduledMessages = await this.scheduledMessageRepository.find({
        where: {
          scheduledTime: Between(startTime, endTime),
          isActive: true,
        },
      });
      return scheduledMessages;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async findOneScheduledMessage(id: number) {
    try {
      const scheduledMessage = await this.scheduledMessageRepository.findOneBy({
        id,
      });
      return scheduledMessage;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async updateScheduledMessage(
    id: number,
    updateScheduledMessageDto: UpdateScheduledMessageDto
  ) {
    try {
      const scheduledMessage = await this.findOneScheduledMessage(id);

      if (!scheduledMessage) return;

      const newScheduledMessage = await this.scheduledMessageRepository.preload(
        {
          ...scheduledMessage,
          ...updateScheduledMessageDto,
        }
      );
      await this.messageRepository.save(newScheduledMessage);

      return newScheduledMessage;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async desactivateScheduledMessage(scheduledMessage: ScheduledMessage) {
    const newScheduledMessage = await this.scheduledMessageRepository.preload({
      ...scheduledMessage,
      isActive: false,
    });
    try {
      await this.messageRepository.save(newScheduledMessage);
      return newScheduledMessage;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async removeScheduledMessage(id: number) {
    const { affected } = await this.scheduledMessageRepository.delete(id);
    if (affected) return `predefined response whit id:${id} removed`;
    return `predefined response whit id:${id} not found`;
  }

  async getScheduledMessagesByRangeTime() {
    const now = new Date();
    const startTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes()
    );
    const endTime = new Date(startTime.getTime() + 60 * 59 * 1000);

    const scheduledMessagesRange = await this.findAllByTimeRange(
      startTime,
      endTime
    );
    const single = scheduledMessagesRange.filter(({ frecuency }) => !frecuency);
    const continouos = scheduledMessagesRange.filter(
      ({ frecuency }) => frecuency
    );
    return { single, continouos };
  }

  // async #recordMedia(msg: WAWebJS.Message) {
  //   const media = await msg.downloadMedia();
  //   // do something with the media data here
  //   return '';
  // }

  private handleExceptions(err: any): never {
    if (err.code === '23505') throw new BadRequestException(err.detail);

    this.logger.error(err);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs'
    );
  }

  // #endregion methods
}

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

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
