import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateReviewDto) {
    return this.prisma.service_reviews.create({
      data: {
        request_id: data.requestId,
        reviewer_id: data.reviewerId,
        technician_id: data.technicianId,
        comment: data.comment,
        rating: data.rating,
        status: data.status ?? 0,
      },
    });
  }

  findAll() {
    return this.prisma.service_reviews.findMany({
      include: {
        request: true,
        reviewer: true,
        technician: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.service_reviews.findUnique({
      where: { id },
      include: {
        request: true,
        reviewer: true,
        technician: true,
      },
    });
  }

  async update(id: number, data: UpdateReviewDto) {
    const review = await this.prisma.service_reviews.findUnique({
      where: { id },
    });
    if (!review) throw new NotFoundException('Review not found');

    return this.prisma.service_reviews.update({
      where: { id },
      data: {
        comment: data.comment,
        rating: data.rating,
        status: data.status,
      },
    });
  }

  async remove(id: number) {
    const review = await this.prisma.service_reviews.findUnique({
      where: { id },
    });
    if (!review) throw new NotFoundException('Review not found');

    return this.prisma.service_reviews.delete({ where: { id } });
  }
}
