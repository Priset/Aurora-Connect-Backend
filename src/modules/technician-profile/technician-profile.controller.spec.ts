import { Test, TestingModule } from '@nestjs/testing';
import { TechnicianProfileController } from './technician-profile.controller';

describe('TechnicianProfileController', () => {
  let controller: TechnicianProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechnicianProfileController],
    }).compile();

    controller = module.get<TechnicianProfileController>(
      TechnicianProfileController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
