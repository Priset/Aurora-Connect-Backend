import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateTicketDto) {
    return this.prisma.service_tickets.create({
      data: {
        request_id: data.requestId,
        status: data.status ?? 0,
        closed_at: data.closedAt ? new Date(data.closedAt) : undefined,
      },
    });
  }

  findAll() {
    return this.prisma.service_tickets.findMany({
      include: { request: true },
    });
  }

  findOne(id: number) {
    return this.prisma.service_tickets.findUnique({
      where: { id },
      include: { request: true },
    });
  }

  async update(id: number, data: UpdateTicketDto) {
    const ticket = await this.prisma.service_tickets.findUnique({
      where: { id },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    return this.prisma.service_tickets.update({
      where: { id },
      data: {
        status: data.status,
        closed_at: data.closedAt ? new Date(data.closedAt) : undefined,
      },
    });
  }

  async remove(id: number) {
    const ticket = await this.prisma.service_tickets.findUnique({
      where: { id },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    return this.prisma.service_tickets.delete({ where: { id } });
  }
}
