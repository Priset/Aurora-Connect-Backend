import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  request_id: number;

  @IsInt()
  technician_id: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsInt()
  @IsOptional()
  status?: number;
}
