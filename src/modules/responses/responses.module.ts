import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResponsesController } from './responses.controller';
import { ResponsesService } from './responses.service';
import { Action, Menu, PredefinedResponse } from './entities';

@Module({
  controllers: [ResponsesController],
  imports: [TypeOrmModule.forFeature([PredefinedResponse, Menu, Action])],
  providers: [ResponsesService],
  exports: [TypeOrmModule],
})
export class ResponsesModule {}
