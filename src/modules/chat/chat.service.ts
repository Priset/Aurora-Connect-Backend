import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Status } from '../../common/enums/status.enum';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateChatDto, userId: number) {
    const request = await this.prisma.service_requests.findUnique({
      where: { id: data.requestId },
      include: { serviceOffers: true },
    });

    if (!request) throw new NotFoundException('Request not found');
    if (request.client_id !== userId)
      throw new ForbiddenException('Only the client can start the chat');
    const existing = await this.prisma.chats.findUnique({
      where: { request_id: data.requestId },
    });

    if (existing)
      throw new ConflictException('Chat already exists for this request');
    const offer = request.serviceOffers[0];
    if (!offer)
      throw new NotFoundException('No technician has offered for this request');

    return this.prisma.chats.create({
      data: {
        request_id: request.id,
        client_id: request.client_id,
        technician_id: offer.technician_id,
        status: Status.CHAT_ACTIVO,
      },
    });
  }

  async findAllForUser(userId: number) {
    return this.prisma.chats.findMany({
      where: {
        AND: [
          {
            OR: [{ client_id: userId }, { technician_id: userId }],
          },
          {
            NOT: { status: Status.ELIMINADO },
          },
        ],
      },
      include: {
        request: true,
        client: true,
        technician: true,
      },
    });
  }

  async findOne(id: number, userId: number) {
    const chat = await this.prisma.chats.findUnique({
      where: { id },
      include: {
        request: true,
        client: true,
        technician: true,
      },
    });

    if (!chat || (chat.status as Status) === Status.ELIMINADO)
      throw new NotFoundException('Chat not found');
    if (chat.client_id !== userId && chat.technician_id !== userId)
      throw new ForbiddenException('Access denied to this chat');

    return chat;
  }

  async update(id: number, data: UpdateChatDto, userId: number) {
    const chat = await this.prisma.chats.findUnique({ where: { id } });
    if (!chat) throw new NotFoundException('Chat not found');
    if (chat.client_id !== userId && chat.technician_id !== userId)
      throw new ForbiddenException('You can only update your own chat');

    return this.prisma.chats.update({
      where: { id },
      data: {
        status: data.status,
      },
    });
  }

  async remove(id: number, userId: number) {
    const chat = await this.prisma.chats.findUnique({ where: { id } });

    if (!chat || (chat.status as Status) === Status.ELIMINADO)
      throw new NotFoundException('Chat not found');

    if (chat.client_id !== userId && chat.technician_id !== userId)
      throw new ForbiddenException('You can only delete your own chat');

    return this.prisma.chats.update({
      where: { id },
      data: { status: Status.ELIMINADO },
    });
  }
}
