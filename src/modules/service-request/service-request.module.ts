import { Module } from '@nestjs/common';
import { ServiceRequestController } from './service-request.controller';
import { ServiceRequestService } from './service-request.service';
import { ServiceRequestGateway } from './service-request.gateway';

@Module({
  controllers: [ServiceRequestController],
  providers: [ServiceRequestService, ServiceRequestGateway],
  exports: [ServiceRequestGateway],
})
export class ServiceRequestModule {}
