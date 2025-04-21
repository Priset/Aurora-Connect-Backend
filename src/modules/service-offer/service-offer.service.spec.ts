import { Test, TestingModule } from '@nestjs/testing';
import { ServiceOfferService } from './service-offer.service';

describe('ServiceOfferService', () => {
  let service: ServiceOfferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceOfferService],
    }).compile();

    service = module.get<ServiceOfferService>(ServiceOfferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
