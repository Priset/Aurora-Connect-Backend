import { IsInt, IsNumber, IsString, Min } from 'class-validator';

export class CreateServiceRequestDto {
  @IsInt()
  clientId: number;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  offeredPrice: number;
}
