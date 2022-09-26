import { Module } from '@nestjs/common';
import { BotwsService } from './botws.service';
import { BotwsGateway } from './botws.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [BotwsGateway, BotwsService],
  imports: [AuthModule]
})
export class BotwsModule {}
