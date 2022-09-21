import { Test, TestingModule } from '@nestjs/testing';
import { BotwsService } from './botws.service';

describe('BotwsService', () => {
  let service: BotwsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotwsService],
    }).compile();

    service = module.get<BotwsService>(BotwsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
