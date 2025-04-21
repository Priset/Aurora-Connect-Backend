import { Test, TestingModule } from '@nestjs/testing';
import { AiSupportService } from './ai-support.service';

describe('AiSupportService', () => {
  let service: AiSupportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiSupportService],
    }).compile();

    service = module.get<AiSupportService>(AiSupportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
