import { IsInt, IsOptional } from 'class-validator';

export class CreateChatDto {
  @IsInt()
  requestId: number;

  @IsInt()
  @IsOptional()
  status?: number;
}
