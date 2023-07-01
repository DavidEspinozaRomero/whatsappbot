import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { Response } from './entities/response.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ResponsesController],
  imports: [TypeOrmModule.forFeature([Response])],
  providers: [ResponsesService],
  exports: [TypeOrmModule],
})
export class ResponsesModule {}
