import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateServiceOfferDto {
  @IsInt()
  requestId: number;

  @IsString()
  @IsOptional()
  message?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  proposedPrice?: number;
}
