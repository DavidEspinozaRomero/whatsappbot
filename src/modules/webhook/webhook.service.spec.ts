import { Test, TestingModule } from '@nestjs/testing';
import { WebhookService } from './webhook.service';
import { Client, LocalAuth } from 'whatsapp-web.js';

describe('WebhookService', () => {
  let service: WebhookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhookService],
    }).compile();

    service = module.get<WebhookService>(WebhookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createClient', () => {
    
    it('empty', () => {
      expect(true).toBeTruthy();
    });
  });
});
