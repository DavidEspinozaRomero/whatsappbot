import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class PaymentsService {
  constructor(private readonly authService: AuthService) {}

  async confirmPayment(user: User) {
    await this.authService.confirmPayment(user);
    return { message: `Payment done` };
  }

  //#region Methods
  paypal(user: User) {
    this.authService.confirmPayment(user);
    return { message: `This action returns paypal payments` };
  }

  //#endregion Methods
}
