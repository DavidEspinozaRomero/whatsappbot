import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService,
    ) {}

  @Post()
  @Auth()
  create(@Body() createMessageDto: CreateMessageDto, @GetUser() user: User) {
    return this.messagesService.create(createMessageDto, user);
  }

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}
