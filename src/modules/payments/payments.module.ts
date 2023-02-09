import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { AuthModule, AuthService } from '../auth';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, AuthService],
  imports: [AuthModule]
})
export class PaymentsModule {}
