import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { Media } from './entities/media.entity';

@Module({
  controllers: [MediaController],
  providers: [MediaService],
  imports: [TypeOrmModule.forFeature([Media])],
  exports: [TypeOrmModule],
})
export class MediaModule {}
