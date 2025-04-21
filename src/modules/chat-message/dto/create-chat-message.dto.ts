import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateChatMessageDto {
  @IsInt()
  chatId: number;

  @IsInt()
  senderId: number;

  @IsString()
  message: string;

  @IsInt()
  @IsOptional()
  status?: number;
}
