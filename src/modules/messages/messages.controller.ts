import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { ValidRoles } from '../auth/interfaces/valid-roles';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // @Post()
  // @Auth()
  // create(@Body() createMessageDto: CreateMessageDto, @GetUser() user: User) {
  //   return this.messagesService.create(createMessageDto, user);
  // }

  // @Post('/query')
  // @Auth()
  // createQuery(
  //   @Body() createQueryMessageDto: CreateQueryMessageDto,
  //   @GetUser() user: User
  // ) {
  //   return this.messagesService.createQuery(createQueryMessageDto, user);
  // }

  // @Get()
  // @Auth()
  // findAll(@Param() query: PaginationDTO, @GetUser() user: User) {
  //   return this.messagesService.findAll(query, user);
  // }

  // @Get('/find-queries')
  // @Auth()
  // findQueriesAll(@Param() query: PaginationDTO, @GetUser() user: User) {
  //   return this.messagesService.findQueriesAll(query, user);
  // }

  // @Get('/get-types')
  // @Auth(ValidRoles.user)
  // getAllTypes() {
  //   return this.messagesService.getTypes();
  // }

  // @Get('/get-categories')
  // // @Auth(ValidRoles.user)
  // getAllCategories() {
  //   return this.messagesService.getCategories();
  // }

  // @Get(':id')
  // // @Auth()
  // findOne(@Param('id') id: string, @GetUser() user: User) {
  //   return this.messagesService.findOne(+id, user);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
  //   return this.messagesService.update(+id, updateMessageDto);
  // }

  // @Delete(':id')
  // @Auth()
  // remove(@Param('id') id: string, @GetUser() user: User) {
  //   return this.messagesService.remove(id, user);
  // }
}
