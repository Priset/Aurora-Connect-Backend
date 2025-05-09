import { Module } from '@nestjs/common';
import { ServiceOfferController } from './service-offer.controller';
import { ServiceOfferService } from './service-offer.service';
import { ServiceOfferGateway } from './service-offer.gateway';

@Module({
  controllers: [ServiceOfferController],
  providers: [ServiceOfferService, ServiceOfferGateway],
  exports: [ServiceOfferGateway],
})
export class ServiceOfferModule {}
