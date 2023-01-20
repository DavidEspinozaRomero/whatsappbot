import { Module } from '@nestjs/common';

import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { AuthModule, AuthService } from '../auth';
import { MessagesModule, MessagesService } from '../messages';

@Module({
  controllers: [SeedController],
  providers: [SeedService, AuthService, MessagesService],
  imports: [AuthModule, MessagesModule],
})
export class SeedModule {}
