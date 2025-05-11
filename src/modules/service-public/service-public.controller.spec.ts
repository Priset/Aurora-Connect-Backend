import { Test, TestingModule } from '@nestjs/testing';
import { ServicePublicController } from './service-public.controller';
import { ServicePublicService } from './service-public.service';

describe('ServicePublicController', () => {
  let controller: ServicePublicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicePublicController],
      providers: [ServicePublicService],
    }).compile();

    controller = module.get<ServicePublicController>(ServicePublicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
