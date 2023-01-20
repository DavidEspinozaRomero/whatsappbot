import { Injectable, Logger } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';

import { Not, Repository } from 'typeorm';

import { PaginationDTO } from '../common/dto/pagination.dto';

import { User } from '../auth/entities/user.entity';
import { Message } from './entities/message.entity';
import { CreateMessageDto, UpdateMessageDto } from './dto';
import { TypeMessage } from './entities/typeMessage.entity';
import { Category, TypeCategory } from './entities/category.entity';

@Injectable()
export class MessagesService {
  //#region variables
  private readonly logger = new Logger('MessagesService');
  //#endregion variables
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(TypeMessage)
    private readonly typeMessageRepository: Repository<TypeMessage>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async create(createMessageDto: CreateMessageDto, user: User) {
    try {
      const category = { id: createMessageDto.category };
      const newMessage: Message = this.messageRepository.create({
        ...createMessageDto,
        category,
        user,
      });
      await this.messageRepository.save(newMessage);
      delete newMessage.user;
      return { message: 'mensaje agregado', ...newMessage };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async findAll(query: PaginationDTO, user: User) {
    const { limit = 10, offset = 0 } = query;
    try {
      const query = this.messageRepository.createQueryBuilder('messages');
      query
        .where({ user })
        .skip(offset)
        .take(limit)
        .leftJoinAndSelect('messages.category', 'category');

      const allmessages = await query.getMany();
      const data = allmessages.map((message) => {
        const { category, ...dataMessage } = message;

        return { ...dataMessage, category: category.description };
      });
      return { message: `This action returns all messages`, data };
    } catch (err) {
      console.log(err);
    }
  }

  async findOne(id: number, user: User) {
    const message = await this.messageRepository.findOne({
      where: { id },
    });

    if (!message) throw new NotFoundException('message not found');

    return { message: `This action returns a #${id} message`, data: message };
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const category = { id: updateMessageDto.category || 0 };
    const msg = await this.messageRepository.preload({
      id,
      ...updateMessageDto,
      category,
    });
    if (!msg) throw new NotFoundException(`Message whit #${id} not found`);
    try {
      await this.messageRepository.save(msg);
      return { message: `This action updates a #${id} message`, data: msg };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async remove(id: string, user: User) {
    const message = await this.messageRepository.delete(id);
    if (!message.affected)
      throw new NotFoundException(`not found task whit id: ${id}`);
  }

  async addCategory(category: TypeCategory) {
    try {
      const newCategory: Category = await this.categoryRepository.create({
        description: category,
      });
      await this.categoryRepository.save(newCategory);
      return { message: 'category created', newCategory };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async getCategories() {
    return this.categoryRepository.find();
  }

  // #region methods
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
