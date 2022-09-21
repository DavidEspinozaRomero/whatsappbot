import { Module } from '@nestjs/common';
import { BotwsService } from './botws.service';
import { BotwsGateway } from './botws.gateway';

@Module({
  providers: [BotwsGateway, BotwsService]
})
export class BotwsModule {}
