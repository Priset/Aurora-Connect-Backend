import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';

@Injectable()
export class ServiceRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateServiceRequestDto, userId: number) {
    return this.prisma.service_requests.create({
      data: {
        client_id: userId,
        description: data.description,
        offered_price: data.offeredPrice,
        status: data.status ?? 0,
      },
    });
  }

  async findAllForUser(userId: number) {
    return this.prisma.service_requests.findMany({
      where: { client_id: userId },
      include: { client: true },
    });
  }

  async findOne(id: number, userId: number) {
    const request = await this.prisma.service_requests.findUnique({
      where: { id },
      include: { client: true },
    });

    if (!request) throw new NotFoundException('Service request not found');
    if (request.client_id !== userId)
      throw new ForbiddenException('Access denied to this request');

    return request;
  }

  async findAllForTechnicians() {
    return this.prisma.service_requests.findMany({
      include: {
        client: {
          select: {
            name: true,
            last_name: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async update(id: number, data: UpdateServiceRequestDto, userId: number) {
    const request = await this.prisma.service_requests.findUnique({
      where: { id },
    });

    if (!request) throw new NotFoundException('Service request not found');
    if (request.client_id !== userId)
      throw new ForbiddenException('You can only update your own request');

    return this.prisma.service_requests.update({
      where: { id },
      data: {
        description: data.description,
        offered_price: data.offeredPrice,
        status: data.status,
      },
    });
  }

  async remove(id: number, userId: number) {
    const request = await this.prisma.service_requests.findUnique({
      where: { id },
    });

    if (!request) throw new NotFoundException('Service request not found');
    if (request.client_id !== userId)
      throw new ForbiddenException('You can only delete your own request');

    return this.prisma.service_requests.delete({ where: { id } });
  }
}
