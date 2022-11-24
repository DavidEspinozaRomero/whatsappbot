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
  //#endregion methods

}

//#region interface

//#endregion interface

