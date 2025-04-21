import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';

@Injectable()
export class ServiceRequestService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateServiceRequestDto) {
    return this.prisma.service_requests.create({
      data: {
        client_id: data.clientId,
        description: data.description,
        offered_price: data.offeredPrice,
      },
    });
  }

  findAll() {
    return this.prisma.service_requests.findMany({ include: { client: true } });
  }

  findOne(id: number) {
    return this.prisma.service_requests.findUnique({
      where: { id },
      include: { client: true },
    });
  }

  async update(id: number, data: UpdateServiceRequestDto) {
    const request = await this.prisma.service_requests.findUnique({
      where: { id },
    });
    if (!request) throw new NotFoundException('Service request not found');
    return this.prisma.service_requests.update({ where: { id }, data });
  }

  async remove(id: number) {
    const request = await this.prisma.service_requests.findUnique({
      where: { id },
    });
    if (!request) throw new NotFoundException('Service request not found');
    return this.prisma.service_requests.delete({ where: { id } });
  }
}
