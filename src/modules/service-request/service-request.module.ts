import { Module } from '@nestjs/common';
import { ServiceRequestController } from './service-request.controller';
import { ServiceRequestService } from './service-request.service';

@Module({
  controllers: [ServiceRequestController],
  providers: [ServiceRequestService],
})
export class ServiceRequestModule {}
