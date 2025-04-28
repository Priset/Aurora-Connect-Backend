import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateTechnicianProfileDto {
  @IsInt()
  userId: number;

  @IsString()
  @IsOptional()
  experience?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  yearsExperience?: number;

  @IsOptional()
  @IsInt()
  status?: number;
}
