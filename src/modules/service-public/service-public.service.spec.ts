import { Test, TestingModule } from '@nestjs/testing';
import { ServicePublicService } from './service-public.service';

describe('ServicePublicService', () => {
  let service: ServicePublicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicePublicService],
    }).compile();

    service = module.get<ServicePublicService>(ServicePublicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
