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

import { createReadStream } from 'fs';
import { join } from 'path';

import { BotWebwhatsapService } from './bot-webwhatsap.service';

@Controller('bot-webwhatsap')
export class BotWebwhatsapController {
  constructor(private readonly botWebwhatsapService: BotWebwhatsapService) {}

  @Get('qrcode')
  qrcode(): StreamableFile {
    return this.botWebwhatsapService.qrcode();
  }

  @Get('qrimg')
  getFile(): StreamableFile {
    return this.botWebwhatsapService.qrimg();
  }
  // qrimg(@Res() res: Response) {
  //   this.botWebwhatsapService.qrimg()
  //   const file = createReadStream(join(process.cwd(), 'qr/i_love_qr.png'));
  //   file.pipe(res);
  // }

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
