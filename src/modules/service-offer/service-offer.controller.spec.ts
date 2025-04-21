import { Test, TestingModule } from '@nestjs/testing';
import { ServiceOfferController } from './service-offer.controller';

describe('ServiceOfferController', () => {
  let controller: ServiceOfferController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceOfferController],
    }).compile();

    controller = module.get<ServiceOfferController>(ServiceOfferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
