import { Injectable, Logger } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  //#region variables
  private readonly logger = new Logger('ContactsService');
  //#endregion variables

  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>
  ) {}
  async create(createContactDto: CreateContactDto) {
    try {
      const newContact = this.contactRepository.create(createContactDto);
      await this.contactRepository.save(newContact);

      return newContact;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  findAll() {
    return `This action returns all contacts`;
  }

  async findOne(id: number) {
    try {
      const contact = await this.contactRepository.findOneBy({ id });
      return contact;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async findOneByPhone(cellphone: string) {
    try {
      const user = await this.contactRepository.findOneBy({ cellphone });
      return user;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async updateLastSeen(contact: Contact) {
    const updatedContact = await this.contactRepository.preload({
      ...contact,
      last_seen: new Date(),
    });

    try {
      await this.contactRepository.save(updatedContact);
      return updatedContact;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    return `This action updates a #${id} contact ${updateContactDto}`;
  }
  async checkContact(
    WACellphone: string,
    username: string,
    isBlocked: boolean,
    isBusiness: boolean,
    isEnterprise: boolean
  ): Promise<Contact> {
    let contact = await this.findOneByPhone(WACellphone);

    // check and create contact
    if (!contact) {
      contact = await this.create({
        cellphone: WACellphone,
        created_at: new Date(),
        last_seen: new Date(),
        username,
        isBlocked,
        isBusiness,
        isEnterprise,
      });
    } else {
      contact = await this.updateLastSeen({
        ...contact,
        username,
        isBlocked,
        isBusiness,
        isEnterprise,
        last_seen: new Date(),
      });
    }

    return contact;
  }

  remove(id: number) {
    return `This action removes a #${id} contact`;
  }

  handleExceptions(err: any): never {
    if (err.code === '23505') throw new BadRequestException(err.detail);

    this.logger.error(err);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs'
    );
  }
}
