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
        serviceOffers: true,
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

    // Guardar el nuevo estado
    const updatedRequest = await this.prisma.service_requests.update({
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

    const isClient = request.client_id === userId;
    const offer = request.serviceOffers.find(
      (o) =>
        o.technician_id === userId ||
        (isClient && (o.status as Status) === Status.ACEPTADO_POR_TECNICO),
    );

    const technicianId = offer?.technician_id;

    // 1. El técnico acepta la solicitud (sin contraoferta)
    if (status === Status.ACEPTADO_POR_TECNICO && !offer) {
      await this.prisma.service_offers.create({
        data: {
          request_id: id,
          technician_id: userId,
          proposed_price: request.offered_price,
          status: Status.ACEPTADO_POR_TECNICO,
        },
      });
    }

    // 2. El cliente acepta una oferta ya aceptada por el técnico
    if (status === Status.ACEPTADO_POR_CLIENTE && offer && technicianId) {
      await this.prisma.service_offers.updateMany({
        where: {
          request_id: id,
          technician_id: technicianId,
          status: Status.ACEPTADO_POR_TECNICO,
        },
        data: {
          status: Status.ACEPTADO_POR_CLIENTE,
        },
      });
    }

    // 2b. El cliente acepta una contraoferta previa del técnico
    if (
      status === Status.ACEPTADO_POR_CLIENTE &&
      offer?.status === Status.CONTRAOFERTA_POR_TECNICO
    ) {
      await this.prisma.service_offers.update({
        where: { id: offer.id },
        data: { status: Status.ACEPTADO_POR_CLIENTE },
      });

      // Crear el chat y actualizar estado si aún no existe
      if (!request.chat && offer.technician_id) {
        await this.prisma.chats.create({
          data: {
            request_id: id,
            client_id: request.client_id,
            technician_id: offer.technician_id,
            status: Status.CHAT_ACTIVO,
          },
        });

        await this.prisma.service_requests.update({
          where: { id },
          data: { status: Status.CHAT_ACTIVO },
        });
      }
    }

    // 3. Si ambas partes aceptaron, se crea el chat
    const isAcceptedByClient = status === Status.ACEPTADO_POR_CLIENTE;
    const isAcceptedByTechnician =
      offer?.status === Status.ACEPTADO_POR_TECNICO ||
      offer?.status === Status.ACEPTADO_POR_CLIENTE;

    const shouldCreateChat =
      isAcceptedByClient &&
      isAcceptedByTechnician &&
      !request.chat &&
      technicianId;

    if (shouldCreateChat) {
      await this.prisma.chats.create({
        data: {
          request_id: id,
          client_id: request.client_id,
          technician_id: technicianId,
          status: Status.CHAT_ACTIVO,
        },
      });

      // Actualizar estado general del request
      await this.prisma.service_requests.update({
        where: { id },
        data: { status: Status.CHAT_ACTIVO },
      });

      await this.prisma.service_tickets.update({
        where: { id },
        data: { status: Status.CHAT_ACTIVO },
      });

      await this.prisma.service_offers.update({
        where: { id },
        data: { status: Status.CHAT_ACTIVO },
      });
    }

    this.gateway.emitRequestUpdated(updatedRequest);

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
