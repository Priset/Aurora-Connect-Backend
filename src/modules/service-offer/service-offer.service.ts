import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceOfferDto } from './dto/create-service-offer.dto';
import { UpdateServiceOfferDto } from './dto/update-service-offer.dto';

@Injectable()
export class ServiceOfferService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateServiceOfferDto) {
    return this.prisma.service_offers.create({
      data: {
        request_id: data.requestId,
        technician_id: data.technicianId,
        message: data.message,
        proposed_price: data.proposedPrice,
      },
    });
  }

  findAll() {
    return this.prisma.service_offers.findMany({
      include: {
        request: true,
        technician: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.service_offers.findUnique({
      where: { id },
      include: {
        request: true,
        technician: true,
      },
    });
  }

  async update(id: number, data: UpdateServiceOfferDto) {
    const offer = await this.prisma.service_offers.findUnique({
      where: { id },
    });
    if (!offer) throw new NotFoundException('Service offer not found');

    return this.prisma.service_offers.update({
      where: { id },
      data: {
        message: data.message,
        proposed_price: data.proposedPrice,
        status: data.status,
      },
    });
  }

  async remove(id: number) {
    const offer = await this.prisma.service_offers.findUnique({
      where: { id },
    });
    if (!offer) throw new NotFoundException('Service offer not found');

    return this.prisma.service_offers.delete({ where: { id } });
  }
}
