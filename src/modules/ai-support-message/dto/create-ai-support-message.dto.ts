import { IsInt, IsString, IsOptional, IsIn } from 'class-validator';

export class CreateAiSupportMessageDto {
  @IsInt()
  chatId: number;

  @IsString()
  @IsIn(['usuario', 'asistente'])
  role: string;

  @IsString()
  content: string;

  @IsInt()
  @IsOptional()
  status?: number;
}
