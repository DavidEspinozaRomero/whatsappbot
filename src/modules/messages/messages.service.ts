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
import {
  CreateMessageDto,
  UpdateMessageDto,
  CreateQueryMessageDto,
} from './dto';

@Injectable()
export class MessagesService {
  //#region variables
  private readonly logger = new Logger('MessagesService');
  //#endregion variables
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) {}

  async create(createMessageDto: CreateMessageDto, user: User) {
    try {
      const type = { id: createMessageDto.type };
      const newMessage: Message = this.messageRepository.create({
        ...createMessageDto,
        type,
        user,
      });
      await this.messageRepository.save(newMessage);
      delete newMessage.user;
      return { message: 'mensaje agregado', ...newMessage };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async createQuery(createQueryMessageDto: CreateQueryMessageDto, user: User) {
    try {
      const newMessage: Message = this.messageRepository.create({
        ...createQueryMessageDto,
        type: { id: 3 },
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
        .andWhere({ type: Not(3) });

      const allmessages = await query.getMany();
      // const allmessages = await this.messageRepository.find({
      //   skip: offset,
      //   take: limit,
      // });
      return { message: `This action returns all messages`, data: allmessages };
    } catch (err) {
      console.log(err);
    }
  }

  async findQueriesAll(query: PaginationDTO, user: User) {
    const { limit = 10, offset = 0 } = query;
    try {
      const query = this.messageRepository.createQueryBuilder('messages');
      query
        .where({ user })
        .skip(offset)
        .take(limit)
        .andWhere({ type: 3 });

      const allqueries = await query.getMany();
      return { message: `This action returns all queries`, data: allqueries };
    } catch (err) {
      console.log(err);
    }
  }

  async findOne(id: string, user: User) {
    const message = await this.messageRepository.findOne({
      where: { id },
    });

    if (!message) throw new NotFoundException('message not found');

    return { message: `This action returns a #${id} message`, data: message };
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    const type = { id: updateMessageDto.type };
    const msg = await this.messageRepository.preload({
      id,
      ...updateMessageDto,
      type,
    });
    if (!msg) throw new NotFoundException(`Message whit #${id} not found`);
    try {
      await this.messageRepository.save(msg);
      return { message: `This action updates a #${id} message`, data: msg };
    } catch (err) {
      console.log(err);
    }
  }

  async remove(id: string, user: User) {
    const message = await this.messageRepository.delete(id);
    if (!message.affected)
      throw new NotFoundException(`not found task whit id: ${id}`);
  }

  // #region methods
  private handleExceptions(err: any): never {
    if (err.code === '23505') throw new BadRequestException(err.detail);

    this.logger.error(err);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs'
    );
  }
  // #endregion methods
}
