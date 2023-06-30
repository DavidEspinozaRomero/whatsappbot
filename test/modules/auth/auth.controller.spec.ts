import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';

import { LogInUserDto, CreateUserDto } from '../../../src/modules/auth/dto';
import { AuthController } from '../../../src/modules/auth/auth.controller';
import { AuthService } from '../../../src/modules/auth/auth.service';

describe('AuthController', () => {
  let service: AuthService;
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

});
