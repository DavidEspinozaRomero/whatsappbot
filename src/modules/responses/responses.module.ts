import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PredefinedResponse, Response } from './entities';

@Module({
  controllers: [ResponsesController],
  imports: [TypeOrmModule.forFeature([Response, PredefinedResponse])],
  providers: [ResponsesService],
  exports: [TypeOrmModule],
})
export class ResponsesModule {}
