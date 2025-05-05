import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceOfferDto } from './dto/create-service-offer.dto';
import { UpdateServiceOfferDto } from './dto/update-service-offer.dto';
import { Status } from '../../common/enums/status.enum';

@Injectable()
export class ServiceOfferService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateServiceOfferDto, technicianId: number) {
    const existing = await this.prisma.service_offers.findFirst({
      where: {
        request_id: data.requestId,
        technician_id: technicianId,
      },
    });

    if (existing) {
      throw new ConflictException('You have already offered for this request');
    }

    return this.prisma.service_offers.create({
      data: {
        request_id: data.requestId,
        technician_id: technicianId,
        message: data.message,
        proposed_price: data.proposedPrice,
        status: 0,
      },
    });
  }

  async findAllForTechnician(technicianId: number) {
    return this.prisma.service_offers.findMany({
      where: {
        technician_id: technicianId,
        NOT: { status: Status.ELIMINADO },
      },
      include: {
        request: true,
        technician: true,
      },
    });
  }

  async findOne(id: number, technicianId: number) {
    const offer = await this.prisma.service_offers.findUnique({
      where: { id },
      include: { request: true, technician: true },
    });

    if (!offer || (offer.status as Status) === Status.ELIMINADO)
      throw new NotFoundException('Service offer not found');

    if (offer.technician_id !== technicianId)
      throw new ForbiddenException('Access denied to this offer');

    return offer;
  }

  async update(id: number, data: UpdateServiceOfferDto, technicianId: number) {
    const offer = await this.prisma.service_offers.findUnique({
      where: { id },
    });

    if (!offer) throw new NotFoundException('Service offer not found');
    if (offer.technician_id !== technicianId)
      throw new ForbiddenException('Access denied to update this offer');

    return this.prisma.service_offers.update({
      where: { id },
      data: {
        message: data.message,
        proposed_price: data.proposedPrice,
        status: data.status,
      },
    });
  }

  async updateStatus(id: number, status: Status, userId: number) {
    const offer = await this.prisma.service_offers.findUnique({
      where: { id },
    });

    if (!offer || (offer.status as Status) === Status.ELIMINADO)
      throw new NotFoundException('Offer not found');

    if (offer.technician_id !== userId)
      throw new ForbiddenException('Access denied');

    return this.prisma.service_offers.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: number, technicianId: number) {
    const offer = await this.prisma.service_offers.findUnique({
      where: { id },
    });

    if (!offer || (offer.status as Status) === Status.ELIMINADO)
      throw new NotFoundException('Service offer not found');

    if (offer.technician_id !== technicianId)
      throw new ForbiddenException('Access denied to delete this offer');

    return this.prisma.service_offers.update({
      where: { id },
      data: { status: Status.ELIMINADO },
    });
  }
}
