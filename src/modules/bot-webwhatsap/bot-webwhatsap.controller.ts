import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StreamableFile } from '@nestjs/common/file-stream/streamable-file';
import { Auth, GetUser } from '../auth/decorators';
import { BotWebwhatsapService } from './bot-webwhatsap.service';
import { User } from '../auth/entities/user.entity';

@Controller('bot-webwhatsap')
export class BotWebwhatsapController {
  constructor(private readonly botWebwhatsapService: BotWebwhatsapService) {}

  @Get('qrcode')
  @Auth()
  qrcode(@GetUser() user: User): StreamableFile {
    return this.botWebwhatsapService.qrcode(user);
  }

  // @Post('')
  // create(@Body() createBotWebwhatsapDto: CreateBotWebwhatsapDto) {
  //   return this.botWebwhatsapService.create(createBotWebwhatsapDto);
  // }

  // @Get()
  // findAll() {
  //   return this.botWebwhatsapService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.botWebwhatsapService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBotWebwhatsapDto: UpdateBotWebwhatsapDto) {
  //   return this.botWebwhatsapService.update(+id, updateBotWebwhatsapDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.botWebwhatsapService.remove(+id);
  // }
}
