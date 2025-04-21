import { Module } from '@nestjs/common';
import { ServiceOfferController } from './service-offer.controller';
import { ServiceOfferService } from './service-offer.service';

@Module({
  controllers: [ServiceOfferController],
  providers: [ServiceOfferService],
})
export class ServiceOfferModule {}
