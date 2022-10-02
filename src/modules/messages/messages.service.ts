import { Injectable, Logger } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

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
      const newMessage: Message = this.messageRepository.create({
        ...createMessageDto,
        user
      });
      await this.messageRepository.save(newMessage);
      delete newMessage.user
      return { message: 'mensaje agregado', ...newMessage };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async findAll() {
    try {
      // TODO: agregar paginacion
      const allmessages = await this.messageRepository.find();
      return { message: `This action returns all messages`, data: allmessages };
    } catch (err) {
      console.log(err);
    }
  }

  async findOne(id: string) {
    const message = await this.messageRepository.findOne({ where: { id } });

    if (!message) throw new NotFoundException('message not found');

    return { message: `This action returns a #${id} message`, data: message };
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    const msg = await this.messageRepository.preload({
      id,
      ...updateMessageDto,
    });
    if (!msg) throw new NotFoundException(`Product whit #${id} not found`);

    return { message: `This action updates a #${id} message`, data: msg };
  }

  async remove(id: string) {
    // const message = this.messageRepository.remove
    const message = await this.messageRepository.delete(id);
    if (!message.affected)
      throw new NotFoundException(`not found task whit id: ${id}`);
    return { message: `This action removes a #${id} message` };
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
