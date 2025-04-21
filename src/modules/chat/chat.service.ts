import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateChatDto) {
    return this.prisma.chats.create({
      data: {
        request_id: data.requestId,
        client_id: data.clientId,
        technician_id: data.technicianId,
        status: data.status ?? 0,
      },
    });
  }

  findAll() {
    return this.prisma.chats.findMany({
      include: {
        request: true,
        client: true,
        technician: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.chats.findUnique({
      where: { id },
      include: {
        request: true,
        client: true,
        technician: true,
      },
    });
  }

  async update(id: number, data: UpdateChatDto) {
    const chat = await this.prisma.chats.findUnique({ where: { id } });
    if (!chat) throw new NotFoundException('Chat not found');

    return this.prisma.chats.update({
      where: { id },
      data: {
        status: data.status,
      },
    });
  }

  async remove(id: number) {
    const chat = await this.prisma.chats.findUnique({ where: { id } });
    if (!chat) throw new NotFoundException('Chat not found');

    return this.prisma.chats.delete({ where: { id } });
  }
}
