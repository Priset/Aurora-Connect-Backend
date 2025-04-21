import { Test, TestingModule } from '@nestjs/testing';
import { AiSupportMessageController } from './ai-support-message.controller';

describe('AiSupportMessageController', () => {
  let controller: AiSupportMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiSupportMessageController],
    }).compile();

    controller = module.get<AiSupportMessageController>(
      AiSupportMessageController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
