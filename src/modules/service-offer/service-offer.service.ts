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
import { ServiceOfferGateway } from './service-offer.gateway';

@Injectable()
export class ServiceOfferService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: ServiceOfferGateway,
  ) {}

  async create(data: CreateServiceOfferDto, userId: number) {
    const technicianProfile = await this.prisma.technician_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!technicianProfile) {
      throw new NotFoundException('Technician profile not found');
    }

    const existing = await this.prisma.service_offers.findFirst({
      where: {
        request_id: data.requestId,
        technician_id: technicianProfile.id,
      },
    });

    if (existing) {
      throw new ConflictException('You have already offered for this request');
    }

    const offer = await this.prisma.service_offers.create({
      data: {
        request_id: data.requestId,
        technician_id: technicianProfile.id,
        message: data.message,
        proposed_price: data.proposedPrice,
        status: 0,
      },
      include: {
        technician: { include: { user: true } },
        request: true,
      },
    });

    this.gateway.emitOfferCreated(offer);
    return offer;
  }

  async findAllForTechnician(userId: number) {
    const profile = await this.prisma.technician_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new NotFoundException('Technician profile not found');
    }

    return this.prisma.service_offers.findMany({
      where: {
        technician_id: profile.id,
        NOT: { status: Status.ELIMINADO },
      },
      include: {
        request: true,
        technician: { include: { user: true } },
      },
    });
  }

  async findOne(id: number, userId: number) {
    const profile = await this.prisma.technician_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new NotFoundException('Technician profile not found');
    }

    const offer = await this.prisma.service_offers.findUnique({
      where: { id },
      include: {
        request: true,
        technician: { include: { user: true } },
      },
    });

    if (!offer || (offer.status as Status) === Status.ELIMINADO) {
      throw new NotFoundException('Service offer not found');
    }

    if (offer.technician_id !== profile.id) {
      throw new ForbiddenException('Access denied to this offer');
    }

    return offer;
  }

  async update(id: number, data: UpdateServiceOfferDto, userId: number) {
    const profile = await this.prisma.technician_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new NotFoundException('Technician profile not found');
    }

    const offer = await this.prisma.service_offers.findUnique({
      where: { id },
    });

    if (!offer) {
      throw new NotFoundException('Service offer not found');
    }

    if (offer.technician_id !== profile.id) {
      throw new ForbiddenException('Access denied to update this offer');
    }

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
    const profile = await this.prisma.technician_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new NotFoundException('Technician profile not found');
    }

    const offer = await this.prisma.service_offers.findUnique({
      where: { id },
    });

    if (!offer || (offer.status as Status) === Status.ELIMINADO) {
      throw new NotFoundException('Offer not found');
    }

    if (offer.technician_id !== profile.id) {
      throw new ForbiddenException('Access denied');
    }

    const updated = await this.prisma.service_offers.update({
      where: { id },
      data: { status },
      include: {
        technician: { include: { user: true } },
        request: true,
      },
    });

    this.gateway.emitOfferUpdated(updated);
    return updated;
  }

  async remove(id: number, userId: number) {
    const profile = await this.prisma.technician_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new NotFoundException('Technician profile not found');
    }

    const offer = await this.prisma.service_offers.findUnique({
      where: { id },
    });

    if (!offer || (offer.status as Status) === Status.ELIMINADO) {
      throw new NotFoundException('Service offer not found');
    }

    if (offer.technician_id !== profile.id) {
      throw new ForbiddenException('Access denied to delete this offer');
    }

    return this.prisma.service_offers.update({
      where: { id },
      data: { status: Status.ELIMINADO },
    });
  }
}
