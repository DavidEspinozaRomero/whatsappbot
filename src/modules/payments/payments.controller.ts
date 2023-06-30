import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { Auth, GetUser } from '../auth';
import { User } from '../auth/entities/user.entity';
import { NotFoundException } from '@nestjs/common/exceptions';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // @Post('')
  // @Auth()
  // confirmPayment(@Body() body: unknown, @GetUser() user: User) {
  //   console.log(body);

  //   return this.paymentsService.confirmPayment(user);
  // }
}
