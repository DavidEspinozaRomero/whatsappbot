import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';


import { BotWebwhatsapService } from './bot-webwhatsap.service';

@Controller('bot-webwhatsap')
export class BotWebwhatsapController {
  constructor(private readonly botWebwhatsapService: BotWebwhatsapService) {}

  @Get('qrcode')
  qrcode() {
    return this.botWebwhatsapService.qrcode();
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
