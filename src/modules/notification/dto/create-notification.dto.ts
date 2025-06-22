import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsInt()
  user_id: number;

  @IsString()
  content: string;

  @IsInt()
  @IsOptional()
  status?: number;
}
