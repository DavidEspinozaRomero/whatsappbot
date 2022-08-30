import { Test, TestingModule } from '@nestjs/testing';
import { BotWebwhatsapController } from './bot-webwhatsap.controller';
import { BotWebwhatsapService } from './bot-webwhatsap.service';

describe('BotWebwhatsapController', () => {
  let controller: BotWebwhatsapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotWebwhatsapController],
      providers: [BotWebwhatsapService],
    }).compile();

    controller = module.get<BotWebwhatsapController>(BotWebwhatsapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
