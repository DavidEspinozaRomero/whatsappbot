import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthController } from '../../../src/modules/auth/auth.controller';
import { AuthService } from '../../../src/modules/auth/auth.service';
import {
  LogInUserDto,
  CreateUserDto,
  UpdateUserDto,
} from '../../../src/modules/auth/dto';

describe('AuthController', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        // Datos para crear un nuevo usuario
        username: 'user1',
        email: 'user1.gmail.com',
        password: 'user12345.',
      };
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toEqual({
        // Verificación de la respuesta esperada
        username: 'user1',
        email: 'user1.gmail.com',
        password: 'user12345.',
      });
    });
  });

  describe('POST /auth/login', () => {
    it('should log in a user', async () => {
      const loginUserDto: LogInUserDto = {
        // Datos para iniciar sesión
        email: 'user1.gmail.com',
        password: 'user12345.',
      };
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUserDto)
        .expect(200);

      expect(response.body).toEqual({
        // Verificación de la respuesta esperada
      });
    });
  });
});
