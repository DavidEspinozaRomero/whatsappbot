import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { JwtService } from '@nestjs/jwt';
// import { MailerService } from '@nestjs-modules/mailer';
import { NotFoundException } from '@nestjs/common/exceptions';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { LogInUserDto } from './dto/login-user.dto';
// import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  //#region variables
  private readonly logger = new Logger('AuthService');

  //   #testEmailTemplate = `
  //   <table class="main" aria-label="email test">
  //   <tr>
  //     <td style="height: 8px; background-color: black"></td>
  //   </tr>
  //   <tr>
  //     <td style="text-align: center">
  //       <div style="display: inline-block; min-width: 50%; text-align: center">
  //         <h1 style="display: inline-block; margin: 1rem">MODERN</h1>
  //       </div>
  //       <div style="display: inline-block; min-width: 50%; text-align: center">
  //         <img
  //           src="https://randomuser.me/api/portraits/women/34.jpg"
  //           alt="logo"
  //           width="30px"
  //           style="margin-right: 1rem"
  //         />
  //         <img
  //           src="https://randomuser.me/api/portraits/women/34.jpg"
  //           alt="logo"
  //           width="30px"
  //           style="margin-right: 1rem"
  //         />
  //         <img
  //           src="https://randomuser.me/api/portraits/women/34.jpg"
  //           alt="logo"
  //           width="30px"
  //           style="margin-right: 1rem"
  //         />
  //         <img
  //           src="https://randomuser.me/api/portraits/women/34.jpg"
  //           alt="logo"
  //           width="30px"
  //           style="margin-right: 1rem"
  //         />
  //       </div>
  //     </td>
  //   </tr>
  //   <tr>
  //     <td>
  //       <img
  //         src="https://unsplash.com/photos/AFR80W_pT8o/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Njl8fGVtYnJvaWRlcnl8ZW58MHx8fHwxNjQzNDY4NDc3&force=true&w=640"
  //         alt="banner"
  //         width="600"
  //         style="max-width: 100%; aspect-ratio: 16/9"
  //       />
  //     </td>
  //   </tr>
  //   <tr>
  //     <td style="text-align: center">
  //       <div style="display: inline-block; max-width: 200px">
  //         <img
  //           src="https://unsplash.com/photos/AFR80W_pT8o/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Njl8fGVtYnJvaWRlcnl8ZW58MHx8fHwxNjQzNDY4NDc3&force=true&w=640"
  //           width="130"
  //           alt="icon"
  //         />
  //         <br />
  //         <strong> title </strong>
  //         <p style="padding: 1rem">
  //           Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem fugiat
  //           dolores laboriosam vel asperiores
  //         </p>
  //       </div>
  //       <div style="display: inline-block; max-width: 200px">
  //         <img
  //           src="https://unsplash.com/photos/AFR80W_pT8o/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Njl8fGVtYnJvaWRlcnl8ZW58MHx8fHwxNjQzNDY4NDc3&force=true&w=640"
  //           width="130"
  //           alt="icon"
  //         />
  //         <br />
  //         <strong> title </strong>
  //         <p style="padding: 1rem">
  //           Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem fugiat
  //           dolores laboriosam vel asperiores
  //         </p>
  //       </div>
  //       <div style="display: inline-block; max-width: 200px">
  //         <img
  //           src="https://unsplash.com/photos/AFR80W_pT8o/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Njl8fGVtYnJvaWRlcnl8ZW58MHx8fHwxNjQzNDY4NDc3&force=true&w=640"
  //           width="130"
  //           alt="icon"
  //         />
  //         <br />
  //         <strong> title </strong>
  //         <p style="padding: 1rem">
  //           Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem fugiat
  //           dolores laboriosam vel asperiores
  //         </p>
  //       </div>
  //     </td>
  //   </tr>
  //   <tr style="background-color: black; color: white">
  //     <td>
  //       <div style="display: flex; justify-content: center; align-items: center">
  //         <img
  //           src="https://randomuser.me/api/portraits/women/34.jpg"
  //           alt="logo"
  //           width="260"
  //           style="padding: 1rem; max-width: 260px; aspect-ratio: 4/3"
  //         />
  //         <div style="width: 50%; padding: 1rem 2rem">
  //           <h3 style="display: inline-block">Title 1</h3>
  //           <span style="display: inline-block">
  //             Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe,
  //             quos neque. Praesentium aperiam tempora assumenda blanditiis
  //           </span>
  //           <br />
  //           <br />

  //           <button
  //             style="
  //               padding: 0.5rem 1rem;
  //               background-color: white;
  //               border-radius: 1rem;
  //             "
  //           >
  //             Buy me
  //           </button>
  //         </div>
  //       </div>
  //     </td>
  //   </tr>
  //   <tr>
  //     <td>
  //       <div style="padding: 2rem; text-align: center">
  //         <h3 style="display: inline-block">Title Lorem ipsum</h3>
  //         <span style="display: inline-block">
  //           Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe, quos
  //           neque. Praesentium aperiam tempora assumenda blanditiis
  //         </span>
  //         <br />
  //         <br />

  //         <button
  //           style="
  //             padding: 0.5rem 1rem;
  //             color: white;
  //             background-color: black;
  //             border-radius: 1rem;
  //           "
  //         >
  //           Buy me
  //         </button>
  //       </div>
  //     </td>
  //   </tr>
  //   <tr>
  //     <td>
  //       <div
  //         style="
  //           background-color: #222;
  //           color: white;
  //           text-align: center;
  //           padding: 1rem 0;
  //         "
  //       >
  //         <h2>Modern</h2>
  //         <p>HTML Email Template</p>
  //         <p>Ambato - Ecuador</p>
  //         <div style="display: inline-block; min-width: 50%; text-align: center">
  //           <img
  //             src="https://randomuser.me/api/portraits/women/34.jpg"
  //             alt="logo"
  //             width="30px"
  //             style="margin-right: 1rem"
  //           />
  //           <img
  //             src="https://randomuser.me/api/portraits/women/34.jpg"
  //             alt="logo"
  //             width="30px"
  //             style="margin-right: 1rem"
  //           />
  //           <img
  //             src="https://randomuser.me/api/portraits/women/34.jpg"
  //             alt="logo"
  //             width="30px"
  //             style="margin-right: 1rem"
  //           />
  //           <img
  //             src="https://randomuser.me/api/portraits/women/34.jpg"
  //             alt="logo"
  //             width="30px"
  //             style="margin-right: 1rem"
  //           />
  //         </div>

  //         <p>Subscribe</p>
  //       </div>
  //     </td>
  //   </tr>
  // </table>
  //   `;
  //#endregion variables

  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User> // private readonly mailerService: MailerService // private readonly jwtService: JwtService,
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

      // this.confirmMail(newUser, this.getJwtToken({ id: newUser.id }));
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
      // token: this.getJwtToken({ id: user.id }),
    };
  }

  async checkAuthStatus(user: User) {
    const { id, password, isActive, roles, ...userData } = user;
    return {
      id,
      ...userData,
      // token: this.getJwtToken({ id })
    };
  }

  // async confirmPayment(user: User) {
  //   const userPaid = await this.authRepository.preload({
  //     ...user,
  //     isPaid: true,
  //   });

  //   if (!userPaid)
  //     throw new NotFoundException(`User whit #${user.id} not found`);

  //   try {
  //     await this.authRepository.save(userPaid);
  //     return { message: `This action validate a #${userPaid.username}` };
  //   } catch (err) {
  //     this.handleExceptions(err);
  //   }
  // }

  // async verifyEmail(token: string) {
  //   const payload = this.jwtService.verify(token);
  //   const user = await this.authRepository.preload({
  //     ...payload,
  //     isEmail: true,
  //   });

  //   if (!user) throw new NotFoundException(`User whit #${user.id} not found`);
  //   try {
  //     await this.authRepository.save(user);
  //     return { message: `This action validate a #${user.username} email` };
  //   } catch (err) {
  //     this.handleExceptions(err);
  //   }
  // }

  async forgotPassword(email: string) {
    const user = await this.authRepository.findOneBy({ email });

    if (!user) return {};
    // const token = this.getJwtToken({ id: user.id });
    // this.forgotPasswordMail(user, token);
  }

  // async restorePassword(token: string, password: string) {
  //   const payload = this.jwtService.verify(token);
  //   const user = await this.authRepository.preload({
  //     ...payload,
  //     password: bcrypt.hashSync(password, 10),
  //   });

  //   if (!user) throw new NotFoundException(`User whit #${user.id} not found`);
  //   try {
  //     await this.authRepository.save(user);
  //     return { message: `This action validate a #${user.username} email` };
  //   } catch (err) {
  //     this.handleExceptions(err);
  //   }
  // }

  // #region  methods
  // private getJwtToken(payload: JwtPayload) {
  //   return this.jwtService.sign(payload);
  // }

  private handleExceptions(err: any): never {
    if (err.code === '23505') throw new BadRequestException(err.detail);

    this.logger.error(err);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs'
    );
  }

  // confirmMail(user: User, token: string) {
  //   const { username, email } = user;
  //   const htmlDefaultTemplate = `
  //   <div>
  //   <p>
  //     Gracias ${username}.
  //     <br />
  //     Por favor confirma tu correo.
  //   </p>

  //   <a
  //     class="btn btn-primary"
  //     href="https://wwbot.netlify.app/#/auth/verify-email?token=${token}"
  //     role="button"
  //   >
  //     https://wwbot.netlify.app/#/auth/verify-email?token=${token}
  //   </a>
  //   <br>
  //   <a
  //     class="btn btn-primary"
  //     href="https://wwbot.netlify.app/#/auth/verify-email?token=${token}"
  //     role="button"
  //   >
  //     <button
  //       type="button"
  //       style="padding: 0.5rem 1rem; color: snow; background-color: blue; border: 0; border-radius: 1rem; "
  //     >
  //       Confirmar email
  //     </button>
  //   </a>
  // </div>
  // `;

  //   const mailOptions = {
  //     to: email, // list of receivers
  //     from: 'deerhou@gmail.com', // sender address
  //     subject: 'Testing Nest MailerModule ✔', // Subject line
  //     // text: 'welcome', // plaintext body
  //     html: this.#testEmailTemplate, // HTML body content
  //   };

  //   this.mailerService
  //     .sendMail(mailOptions)
  //     .then(() => null)
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  // forgotPasswordMail(user: User, token: string) {
  //   const { username, email } = user;
  //   const htmlDefaultTemplate = `
  //   <div>
  //   <p>
  //     Hola ${username}, se a pedido un cambio de contrasena.
  //   </p>

  //   <a
  //     class="btn btn-primary"
  //     href="https://wwbot.netlify.app/#/auth/restore-password?token=${token}"
  //     role="button"
  //   >
  //     https://wwbot.netlify.app/#/auth/restore-password?token=${token}
  //   </a>
  //   <br>
  //   <a
  //     class="btn btn-primary"
  //     href="https://wwbot.netlify.app/#/auth/restore-password?token=${token}"
  //     role="button"
  //   >
  //     <button
  //       type="button"
  //       style="padding: 0.5rem 1rem; color: snow; background-color: blue; border: 0; border-radius: 1rem; "
  //     >
  //       Confirmar email
  //     </button>
  //   </a>
  // </div>
  // `;

  //   const mailOptions = {
  //     to: email, // list of receivers
  //     from: 'deerhou@gmail.com', // sender address
  //     subject: 'Testing Nest MailerModule ✔', // Subject line
  //     // text: 'welcome', // plaintext body
  //     html: htmlDefaultTemplate, // HTML body content
  //   };

  //   this.mailerService
  //     .sendMail(mailOptions)
  //     .then(() => null)
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

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
