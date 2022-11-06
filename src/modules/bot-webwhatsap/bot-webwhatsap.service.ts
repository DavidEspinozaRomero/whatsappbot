import { Injectable } from '@nestjs/common';
import { StreamableFile } from '@nestjs/common/file-stream/streamable-file';

import * as fs from 'fs';
import { join } from 'path';
import { User } from '../auth/entities/user.entity';

export const FORMATDATE = 'dd-MM-YYYY hh:mm';

@Injectable()
export class BotWebwhatsapService {
  // constructor() {}
  qrcode(user: User): StreamableFile {
    const file = fs.createReadStream(join(process.cwd(), `qr/${user.id}.svg`));
    return new StreamableFile(file);
  }

  //#region methods
  //#emdregion methods

  // create(createBotWebwhatsapDto: CreateBotWebwhatsapDto) {
  //   return 'This action adds a new botWebwhatsap';
  // }

  // findAll() {
  //   return `This action returns all botWebwhatsap`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} botWebwhatsap`;
  // }

  // update(id: number, updateBotWebwhatsapDto: UpdateBotWebwhatsapDto) {
  //   return `This action updates a #${id} botWebwhatsap`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} botWebwhatsap`;
  // }
}

//#region interface

//#endregion interface

