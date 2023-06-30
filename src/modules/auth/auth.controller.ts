import { Controller, Get, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators';
import { LogInUserDto, CreateUserDto } from './dto';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces/valid-roles';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  @Post('login')
  login(@Body() loginUserDto: LogInUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  // @Post('verify-email')
  // verifyEmail(@Body() body: { token: string }) {
  //   const { token } = body;

  //   return this.authService.verifyEmail(token);
  // }

  @Post('forgot-password')
  forgotPassword(@Body() body: { email: string }) {
    const { email } = body;

    return this.authService.forgotPassword(email);
  }

  // @Post('restore-password')
  // restorePassword(@Body() body: { token: string, password }) {
  //   const { token, password } = body;

  //   return this.authService.restorePassword(token, password);
  // }

  @Get('private')
  @Auth(ValidRoles.user, ValidRoles.superUser)
  privateRoute(@GetUser() user: User) {
    return { message: 'private', user };
  }
}
