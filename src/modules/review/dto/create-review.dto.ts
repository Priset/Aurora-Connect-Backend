import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  requestId: number;

  @IsInt()
  reviewerId: number;

  @IsInt()
  technicianId: number;

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
