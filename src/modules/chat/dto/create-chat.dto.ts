import { IsInt, IsOptional } from 'class-validator';

export class CreateChatDto {
  @IsInt()
  requestId: number;

  @IsInt()
  clientId: number;

  @IsInt()
  technicianId: number;

  @IsInt()
  @IsOptional()
  status?: number;
}
