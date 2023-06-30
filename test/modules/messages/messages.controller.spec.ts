import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from '../../../src/modules/messages/messages.controller';
import { MessagesService } from '../../../src/modules/messages/messages.service';

describe('MessagesController', () => {
  let controller: MessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [MessagesService],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
  });

    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
});

