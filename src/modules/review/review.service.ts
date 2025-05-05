import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Status } from '../../common/enums/status.enum';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReviewDto, userId: number) {
    const request = await this.prisma.service_requests.findUnique({
      where: { id: data.requestId },
    });

    if (!request) throw new NotFoundException('Service request not found');
    if (request.client_id !== userId)
      throw new ForbiddenException('You can only review your own requests');
    const ticket = await this.prisma.service_tickets.findUnique({
      where: { request_id: data.requestId },
    });

    if (!ticket || ticket.status !== 2)
      throw new BadRequestException(
        'You can only review after the service is completed',
      );
    const existingReview = await this.prisma.service_reviews.findFirst({
      where: {
        request_id: data.requestId,
        reviewer_id: userId,
      },
    });

    if (existingReview) {
      throw new ConflictException('You already reviewed this request');
    }

    return this.prisma.service_reviews.create({
      data: {
        request_id: data.requestId,
        reviewer_id: userId,
        technician_id: data.technicianId,
        comment: data.comment,
        rating: data.rating,
        status: data.status ?? 0,
      },
    });
  }

  async findAll() {
    return this.prisma.service_reviews.findMany({
      where: {
        NOT: { status: Status.ELIMINADO },
      },
      include: {
        request: true,
        reviewer: true,
        technician: true,
      },
    });
  }

  async findOne(id: number, userId: number) {
    const review = await this.prisma.service_reviews.findUnique({
      where: { id },
      include: {
        request: true,
        reviewer: true,
        technician: true,
      },
    });

    if (!review || (review.status as Status) === Status.ELIMINADO)
      throw new NotFoundException('Review not found');
    if (review.reviewer_id !== userId)
      throw new ForbiddenException('Access denied to this review');

    return review;
  }

  async update(id: number, data: UpdateReviewDto, userId: number) {
    const review = await this.prisma.service_reviews.findUnique({
      where: { id },
    });

    if (!review) throw new NotFoundException('Review not found');
    if (review.reviewer_id !== userId)
      throw new ForbiddenException('You can only update your own review');

    return this.prisma.service_reviews.update({
      where: { id },
      data: {
        comment: data.comment,
        rating: data.rating,
        status: data.status,
      },
    });
  }

  async remove(id: number, userId: number) {
    const review = await this.prisma.service_reviews.findUnique({
      where: { id },
    });

    if (!review || (review.status as Status) === Status.ELIMINADO)
      throw new NotFoundException('Review not found');

    if (review.reviewer_id !== userId)
      throw new ForbiddenException('You can only delete your own review');

    return this.prisma.service_reviews.update({
      where: { id },
      data: { status: Status.ELIMINADO },
    });
  }
}
