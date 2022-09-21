import { Test, TestingModule } from '@nestjs/testing';
import { BotwsGateway } from './botws.gateway';
import { BotwsService } from './botws.service';

describe('BotwsGateway', () => {
  let gateway: BotwsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotwsGateway, BotwsService],
    }).compile();

    gateway = module.get<BotwsGateway>(BotwsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
