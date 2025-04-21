import { Test, TestingModule } from '@nestjs/testing';
import { AiSupportController } from './ai-support.controller';

describe('AiSupportController', () => {
  let controller: AiSupportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiSupportController],
    }).compile();

    controller = module.get<AiSupportController>(AiSupportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
