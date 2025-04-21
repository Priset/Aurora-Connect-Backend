import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceOfferDto } from './create-service-offer.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateServiceOfferDto extends PartialType(CreateServiceOfferDto) {
  @IsInt()
  @IsOptional()
  status?: number;
}
