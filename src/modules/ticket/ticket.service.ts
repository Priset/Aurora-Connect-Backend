import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTicketDto, userId: number) {
    const request = await this.prisma.service_requests.findUnique({
      where: { id: data.requestId },
    });

    if (!request) throw new NotFoundException('Request not found');
    if (request.client_id !== userId)
      throw new ForbiddenException(
        'You can only create tickets for your own requests',
      );

    return this.prisma.service_tickets.create({
      data: {
        request_id: data.requestId,
        status: data.status ?? 0,
        closed_at: data.closedAt ? new Date(data.closedAt) : undefined,
      },
    });
  }

  async findAllForUser(userId: number) {
    return this.prisma.service_tickets.findMany({
      where: {
        request: {
          client_id: userId,
        },
      },
      include: {
        request: true,
      },
    });
  }

  async findOne(id: number, userId: number) {
    const ticket = await this.prisma.service_tickets.findUnique({
      where: { id },
      include: { request: true },
    });

    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.request.client_id !== userId)
      throw new ForbiddenException('Access denied to this ticket');

    return ticket;
  }

  async update(id: number, data: UpdateTicketDto, userId: number) {
    const ticket = await this.prisma.service_tickets.findUnique({
      where: { id },
      include: { request: true },
    });

    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.request.client_id !== userId)
      throw new ForbiddenException('Access denied to update this ticket');

    // Validación extra (opcional)
    if (data.status === 2 && !data.closedAt) {
      throw new BadRequestException(
        'Must provide closedAt when closing the ticket',
      );
    }

    return this.prisma.service_tickets.update({
      where: { id },
      data: {
        status: data.status,
        closed_at: data.closedAt ? new Date(data.closedAt) : undefined,
      },
    });
  }

  async remove(id: number, userId: number) {
    const ticket = await this.prisma.service_tickets.findUnique({
      where: { id },
      include: { request: true },
    });

    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.request.client_id !== userId)
      throw new ForbiddenException('Access denied to delete this ticket');

    return this.prisma.service_tickets.delete({
      where: { id },
    });
  }
}
