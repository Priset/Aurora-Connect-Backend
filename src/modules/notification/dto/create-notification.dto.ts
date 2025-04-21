import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsInt()
  userId: number;

  @IsString()
  content: string;

  @IsInt()
  @IsOptional()
  status?: number;
}
