import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';

@Module({
  controllers: [ContactsController],
  imports: [TypeOrmModule.forFeature([Contact])],
  providers: [ContactsService],
  exports: [TypeOrmModule],
})
export class ContactsModule {}
