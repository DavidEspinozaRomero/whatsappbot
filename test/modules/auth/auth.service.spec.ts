import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { AuthService, CreateUserDto, LogInUserDto } from '../../../src/modules/auth';
import { User } from '../../../src/modules/auth/entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userRepository;
  let findOne;

  beforeEach(async () => {
    userRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    findOne = userRepository.findOne as jest.Mock;

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        MailerModule,
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: JwtService, useValue: { sign: jest.fn() } },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto:CreateUserDto = {
        username:'',
        email: 'usertest1@test.com',
        password: 'Asdf1234.',
      };

      const result = { ...createUserDto, id: 1 };
      userRepository.save.mockResolvedValue(result);

      const savedUser = await authService.create(createUserDto);

      expect(savedUser).toEqual(result);
      expect(userRepository.save).toHaveBeenCalledWith(createUserDto);
    });
  });

  // describe('login', () => {
  //   it('should throw an error if the user is not found', async () => {
  //     findOne.mockResolvedValue(undefined);

  //     const loginUserDto = {
  //       email: 'test@test.com',
  //       password: 'password',
  //     };

  //     await expect(authService.login(loginUserDto)).rejects.toThrow(
  //       NotFoundException
  //     );
  //     expect(userRepository.findOne).toHaveBeenCalledWith({
  //       email: loginUserDto.email,
  //     });
  //   });

  //   it('should throw an error if the password is incorrect', async () => {
  //     const user = new User();
  //     user.id = 1;
  //     user.email = 'test@test.com';
  //     user.password = await bcrypt.hash('password', 10);
  //     findOne.mockResolvedValue(user);

  //     const loginUserDto = {
  //       email: 'test@test.com',
  //       password: 'wrongPassword',
  //     };

  //     await expect(authService.login(loginUserDto)).rejects.toThrow(
  //       UnauthorizedException
  //     );
  //     expect(userRepository.findOne).toHaveBeenCalledWith({
  //       email: loginUserDto.email,
  //     });
  //   });
  // });
});
// it('should return a token if the credentials are correct', async () => {
//   const user = new User();
//   user.id = 1;
//   user.email = 'test@test.com';
//   user.password = await bcrypt.hash('password', 10);
//   findOne.mockResolvedValue(user);

//   const loginUserDto = {
//     email: 'test@test.com',
//     password: 'password',
//   };

//   const token = 'token';
//   jest.spyOn(jwtService, 'sign').
