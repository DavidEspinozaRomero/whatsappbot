import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { LogInUserDto } from './dto/login-user.dto';
import { JwtPayload } from './strategy/jwt.strategy';

@Injectable()
export class AuthService {
  logger = new Logger('auth');
  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const newUser: User = await this.authRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      this.authRepository.save(newUser);
      delete newUser.password;
      return { message: 'User Created', ...newUser };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  async logIn(logInUserDto: LogInUserDto) {
    const { email, password } = logInUserDto;
    const userDb: User = await this.authRepository.findOne({
      where: { email },
      select: { id: true, email: true, password: true },
    });

    if (!userDb) throw new UnauthorizedException('Credentials not valid ');
    if (!bcrypt.compare(password, userDb.password))
      throw new UnauthorizedException('Credentials not valid ');

    delete userDb.password;
    //todo: agregar jwt
    return { ...userDb, token: '' };
  }

  update(id: number, updateAuthDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  //#region methods
  async checkAuthStatus(user: User) {
    const { id, password, isActive, roles, ...userData } = user;
    return { id, ...userData, token: this.getJwtToken({ id }) };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleExceptions(err: any) {
    if (err.code === '23505') throw new BadRequestException(err.detail);

    this.logger.error(err);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
  //#endregion methods
}
