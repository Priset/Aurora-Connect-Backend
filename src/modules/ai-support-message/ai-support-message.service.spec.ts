import { Test, TestingModule } from '@nestjs/testing';
import { AiSupportMessageService } from './ai-support-message.service';

describe('AiSupportMessageService', () => {
  let service: AiSupportMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiSupportMessageService],
    }).compile();

    service = module.get<AiSupportMessageService>(AiSupportMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
