import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { LogInUserDto } from './dto/login-user.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { MailerService } from '@nestjs-modules/mailer';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class AuthService {
  //#region variables
  private readonly logger = new Logger('AuthService');
  //#endregion variables

  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const newUser: User = await this.authRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.authRepository.save(newUser);
      delete newUser.password;

      this.confirmMail(newUser, this.getJwtToken({ id: newUser.id }));
      return {
        message: 'User Created',
      };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async login(logInUserDto: LogInUserDto) {
    const { password, email } = logInUserDto;
    const user = await this.authRepository.findOne({
      where: { email },
      select: { id: true, password: true, email: true, username: true },
    });
    if (!user) throw new UnauthorizedException('Credentials not valid ');
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials not valid ');

    delete user.password;

    return {
      message: `Welcome back`,
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async checkAuthStatus(user: User) {
    const { id, password, isActive, roles, ...userData } = user;
    return { id, ...userData, token: this.getJwtToken({ id }) };
  }

  async confirmPayment(user: User) {
    const userPaid = await this.authRepository.preload({
      ...user,
      isPaid: true,
    });

    if (!userPaid)
      throw new NotFoundException(`User whit #${user.id} not found`);

    try {
      await this.authRepository.save(userPaid);
      return { message: `This action validate a #${userPaid.username}` };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async verifyEmail(token: string) {
    const payload = this.jwtService.verify(token);
    const user = await this.authRepository.preload({
      ...payload,
      isEmail: true,
    });

    if (!user) throw new NotFoundException(`User whit #${user.id} not found`);
    try {
      await this.authRepository.save(user);
      return { message: `This action validate a #${user.username} email` };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async forgotPassword(email: string) {
    const user = await this.authRepository.findOneBy({ email });

    if (!user) return {};
    const token = this.getJwtToken({ id: user.id });
    this.forgotPasswordMail(user, token);
  }

  async restorePassword(token: string, password: string) {
    const payload = this.jwtService.verify(token);
    const user = await this.authRepository.preload({
      ...payload,
      password: bcrypt.hashSync(password, 10),
    });

    if (!user) throw new NotFoundException(`User whit #${user.id} not found`);
    try {
      await this.authRepository.save(user);
      return { message: `This action validate a #${user.username} email` };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  // #region  methods
  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleExceptions(err: any): never {
    if (err.code === '23505') throw new BadRequestException(err.detail);

    this.logger.error(err);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs'
    );
  }

  confirmMail(user: User, token: string) {
    const { username, email } = user;
    const htmlDefaultTemplate = `
    <div>
    <p>
      Gracias ${username}.
      <br />
      Por favor confirma tu correo.
    </p>
  
    <a
      class="btn btn-primary"
      href="https://wwbot.netlify.app/#/auth/verify-email?token=${token}"
      role="button"
    >
      https://wwbot.netlify.app/#/auth/verify-email?token=${token}
    </a>
    <br>
    <a
      class="btn btn-primary"
      href="https://wwbot.netlify.app/#/auth/verify-email?token=${token}"
      role="button"
    >
      <button
        type="button"
        style="padding: 0.5rem 1rem; color: snow; background-color: blue; border: 0; border-radius: 1rem; "
      >
        Confirmar email
      </button>
    </a>
  </div>  
  `;

    const mailOptions = {
      to: email, // list of receivers
      from: 'deerhou@gmail.com', // sender address
      subject: 'Testing Nest MailerModule ✔', // Subject line
      // text: 'welcome', // plaintext body
      html: htmlDefaultTemplate, // HTML body content
    };

    this.mailerService
      .sendMail(mailOptions)
      .then(() => null)
      .catch((err) => {
        console.log(err);
      });
  }

  forgotPasswordMail(user: User, token: string) {
    const { username, email } = user;
    const htmlDefaultTemplate = `
    <div>
    <p>
      Hola ${username}, se a pedido un cambio de contrasena.
    </p>
  
    <a
      class="btn btn-primary"
      href="https://wwbot.netlify.app/#/auth/restore-password?token=${token}"
      role="button"
    >
      https://wwbot.netlify.app/#/auth/restore-password?token=${token}
    </a>
    <br>
    <a
      class="btn btn-primary"
      href="https://wwbot.netlify.app/#/auth/restore-password?token=${token}"
      role="button"
    >
      <button
        type="button"
        style="padding: 0.5rem 1rem; color: snow; background-color: blue; border: 0; border-radius: 1rem; "
      >
        Confirmar email
      </button>
    </a>
  </div>  
  `;

    const mailOptions = {
      to: email, // list of receivers
      from: 'deerhou@gmail.com', // sender address
      subject: 'Testing Nest MailerModule ✔', // Subject line
      // text: 'welcome', // plaintext body
      html: htmlDefaultTemplate, // HTML body content
    };

    this.mailerService
      .sendMail(mailOptions)
      .then(() => null)
      .catch((err) => {
        console.log(err);
      });
  }

  // #endregion  methods

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // update(id: number, updateAuthDto: UpdateUserDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
