import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreateTicketDto {
  @IsInt()
  requestId: number;

  @IsInt()
  @IsOptional()
  status?: number;

  @IsDateString()
  @IsOptional()
  closedAt?: string;
}
