import { Module } from '@nestjs/common';
import { ServicePublicService } from './service-public.service';
import { ServicePublicController } from './service-public.controller';

@Module({
  controllers: [ServicePublicController],
  providers: [ServicePublicService],
})
export class ServicePublicModule {}
