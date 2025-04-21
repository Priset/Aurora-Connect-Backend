import { IsInt, IsOptional } from 'class-validator';

export class CreateAiSupportChatDto {
  @IsInt()
  userId: number;

  @IsInt()
  @IsOptional()
  status?: number;
}
