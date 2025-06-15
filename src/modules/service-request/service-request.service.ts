import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { Status } from 'src/common/enums/status.enum';
import { ServiceRequestGateway } from './service-request.gateway';
import { service_offers } from '@prisma/client';

@Injectable()
export class ServiceRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: ServiceRequestGateway,
  ) {}

  async create(data: CreateServiceRequestDto, userId: number) {
    const request = await this.prisma.service_requests.create({
      data: {
        client_id: userId,
        description: data.description,
        offered_price: data.offeredPrice,
        status: data.status ?? Status.PENDIENTE,
      },
      include: { client: true },
    });
    await this.prisma.service_tickets.create({
      data: {
        request_id: request.id,
        status: Status.PENDIENTE,
      },
    });
    this.gateway.emitNewServiceRequest(request);

    return request;
  }

  async findAllForUser(userId: number) {
    return this.prisma.service_requests.findMany({
      where: {
        client_id: userId,
        NOT: { status: Status.ELIMINADO },
      },
      include: { client: true, serviceOffers: true },
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
      where: {
        NOT: { status: Status.ELIMINADO },
      },
      include: {
        client: {
          select: {
            name: true,
            last_name: true,
          },
        },
        serviceOffers: {
          select: {
            id: true,
            technician_id: true,
            status: true,
            message: true,
            proposed_price: true,
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

  async updateStatus(id: number, status: Status, userId: number) {
    const request = await this.prisma.service_requests.findUnique({
      where: { id },
      include: { serviceOffers: true, chat: true },
    });

    if (!request) throw new NotFoundException('Service request not found');

    const isClient = request.client_id === userId;
    const technicianProfile = isClient
      ? null
      : await this.prisma.technician_profiles.findUnique({
          where: { user_id: userId },
        });

    if (!isClient && !technicianProfile) {
      throw new NotFoundException('Technician profile not found');
    }

    const technicianId = technicianProfile?.id;

    // Buscar si ya hay una oferta previa del técnico
    let offer: service_offers | undefined;

    if (isClient) {
      offer = request.serviceOffers.find(
        (o) =>
          (o.status as Status) === Status.ACEPTADO_POR_TECNICO ||
          (o.status as Status) === Status.CONTRAOFERTA_POR_TECNICO,
      );
    } else if (technicianProfile?.id) {
      offer = request.serviceOffers.find(
        (o) => o.technician_id === technicianProfile.id,
      );
    }

    // 1. ACEPTADO_POR_TECNICO (con o sin oferta previa)
    if (status === Status.ACEPTADO_POR_TECNICO && technicianId) {
      if (offer) {
        await this.prisma.service_offers.update({
          where: { id: offer.id },
          data: { status: Status.ACEPTADO_POR_TECNICO },
        });
      } else {
        await this.prisma.service_offers.create({
          data: {
            request_id: id,
            technician_id: technicianId,
            proposed_price: request.offered_price,
            status: Status.ACEPTADO_POR_TECNICO,
          },
        });
      }
    }

    // 2. CONTRAOFERTA_POR_TECNICO
    if (status === Status.CONTRAOFERTA_POR_TECNICO && offer && technicianId) {
      await this.prisma.service_offers.update({
        where: { id: offer.id },
        data: { status: Status.CONTRAOFERTA_POR_TECNICO },
      });
    }

    // 3. RECHAZADO_POR_TECNICO
    if (status === Status.RECHAZADO_POR_TECNICO && offer && technicianId) {
      await this.prisma.service_offers.update({
        where: { id: offer.id },
        data: { status: Status.RECHAZADO_POR_TECNICO },
      });
    }

    // 4. ACEPTADO_POR_CLIENTE (cliente acepta oferta previa)
    if (status === Status.ACEPTADO_POR_CLIENTE && isClient && offer) {
      await this.prisma.service_offers.update({
        where: { id: offer.id },
        data: { status: Status.ACEPTADO_POR_CLIENTE },
      });
    }

    // 5. RECHAZADO_POR_CLIENTE (cliente rechaza oferta previa)
    if (status === Status.RECHAZADO_POR_CLIENTE && isClient && offer) {
      await this.prisma.service_offers.update({
        where: { id: offer.id },
        data: { status: Status.RECHAZADO_POR_CLIENTE },
      });
    }

    let updatedOffer = offer;

    if (offer?.id) {
      const refreshed = await this.prisma.service_offers.findUnique({
        where: { id: offer.id },
      });

      if (!refreshed) {
        throw new NotFoundException('Updated offer not found');
      }

      updatedOffer = refreshed;
    }

    // Evaluar si ambas partes aceptaron para crear chat
    const isAcceptedByClient = status === Status.ACEPTADO_POR_CLIENTE;
    const isAcceptedByTechnician =
      updatedOffer?.status === Status.ACEPTADO_POR_TECNICO ||
      updatedOffer?.status === Status.ACEPTADO_POR_CLIENTE;

    const shouldCreateChat =
      isAcceptedByClient &&
      isAcceptedByTechnician &&
      !request.chat &&
      updatedOffer?.technician_id;

    if (shouldCreateChat && updatedOffer) {
      await this.prisma.chats.create({
        data: {
          request_id: id,
          client_id: request.client_id,
          technician_id: updatedOffer.technician_id,
          status: Status.CHAT_ACTIVO,
        },
      });

      await this.prisma.service_requests.update({
        where: { id },
        data: { status: Status.CHAT_ACTIVO },
      });

      await this.prisma.service_tickets.update({
        where: { request_id: id },
        data: { status: Status.CHAT_ACTIVO },
      });

      await this.prisma.service_offers.update({
        where: { id: updatedOffer.id },
        data: { status: Status.CHAT_ACTIVO },
      });
    } else {
      // Solo actualizar estado general del request si no se creó chat
      await this.prisma.service_requests.update({
        where: { id },
        data: { status },
      });

      await this.prisma.service_tickets.updateMany({
        where: {
          request_id: id,
          NOT: { status: Status.ELIMINADO },
        },
        data: { status },
      });
    }

    const updatedRequest = await this.prisma.service_requests.findUnique({
      where: { id },
      include: { client: true, serviceOffers: true, chat: true },
    });

    this.gateway.emitRequestUpdated(updatedRequest!);
    return updatedRequest;
  }

  async remove(id: number, userId: number) {
    const request = await this.prisma.service_requests.findUnique({
      where: { id },
    });

    if (!request) throw new NotFoundException('Service request not found');
    if (request.client_id !== userId)
      throw new ForbiddenException('You can only delete your own request');

    return this.prisma.service_requests.update({
      where: { id },
      data: { status: Status.ELIMINADO },
    });
  }
}
