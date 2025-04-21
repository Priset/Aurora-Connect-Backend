import { Test, TestingModule } from '@nestjs/testing';
import { TechnicianProfileService } from './technician-profile.service';

describe('TechnicianProfileService', () => {
  let service: TechnicianProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TechnicianProfileService],
    }).compile();

    service = module.get<TechnicianProfileService>(TechnicianProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
