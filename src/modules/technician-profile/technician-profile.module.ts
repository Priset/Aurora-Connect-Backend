import { Module } from '@nestjs/common';
import { TechnicianProfileController } from './technician-profile.controller';
import { TechnicianProfileService } from './technician-profile.service';

@Module({
  controllers: [TechnicianProfileController],
  providers: [TechnicianProfileService],
})
export class TechnicianProfileModule {}
