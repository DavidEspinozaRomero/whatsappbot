import { Test, TestingModule } from '@nestjs/testing';
import { BotWebwhatsapService } from './bot-webwhatsap.service';

describe('BotWebwhatsapService', () => {
  let service: BotWebwhatsapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotWebwhatsapService],
    }).compile();

    service = module.get<BotWebwhatsapService>(BotWebwhatsapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
