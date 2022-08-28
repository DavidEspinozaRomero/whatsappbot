import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { LogInUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const newUser: User = await this.authRepository.create({
        password: bcrypt.hashSync(password, 10),
        ...userData,
      });
      await this.authRepository.save(newUser);
      delete newUser.password;
      return { message: 'User Created', user: { ...newUser } };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async login(logInUserDto: LogInUserDto) {
    const { password, email } = logInUserDto;
    const user = await this.authRepository.findOne({
      where: { email },
      select: { password: true, email: true },
    });
    if (!user) throw new UnauthorizedException('Credentials not valid ');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials not valid ');

    // TODO: adjuntar el jwt
    delete user.password
    
    return { message: `Welcome back`, user };
  }
  // #region  methods
  private handleExceptions(err: any): never {
    if (err.code === '23505') throw new BadRequestException(err.detail);

    // this.logger.error(err);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs'
    );
  }
  // #endregion  methods

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateUserDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
