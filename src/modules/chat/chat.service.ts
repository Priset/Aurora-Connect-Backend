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
      include: {
        serviceOffers: true,
      },
    });

    if (!request) throw new NotFoundException('Request not found');
    if (request.client_id !== userId)
      throw new ForbiddenException('Only the client can start the chat');

    const existing = await this.prisma.chats.findUnique({
      where: { request_id: data.requestId },
    });

    if (existing)
      throw new ConflictException('Chat already exists for this request');

    const offer = request.serviceOffers.find(
      (o: { status: Status }) => o.status === Status.ACEPTADO_POR_CLIENTE,
    );

    if (!offer)
      throw new NotFoundException('No accepted offer for this request');

    return this.prisma.chats.create({
      data: {
        request_id: request.id,
        client_id: request.client_id,
        technician_id: offer.technician_id,
        status: Status.CHAT_ACTIVO,
      },
      include: {
        request: true,
        client: true,
        technician: {
          include: { user: true },
        },
      },
    });
  }

  async findAllForUser(userId: number) {
    const profile = await this.prisma.technician_profiles.findUnique({
      where: { user_id: userId },
    });

    return this.prisma.chats.findMany({
      where: {
        OR: [{ client_id: userId }, { technician_id: profile?.id || -1 }],
        NOT: { status: Status.ELIMINADO },
      },
      include: {
        request: true,
        client: true,
        technician: {
          include: { user: true },
        },
      },
    });
  }

  async findOne(id: number, userId: number) {
    const profile = await this.prisma.technician_profiles.findUnique({
      where: { user_id: userId },
    });

    const chat = await this.prisma.chats.findUnique({
      where: { id },
      include: {
        request: true,
        client: true,
        technician: {
          include: { user: true },
        },
      },
    });

    if (!chat || (chat.status as Status) === Status.ELIMINADO)
      throw new NotFoundException('Chat not found');

    const isParticipant =
      chat.client_id === userId || chat.technician_id === profile?.id;

    if (!isParticipant)
      throw new ForbiddenException('Access denied to this chat');

    return chat;
  }

  async update(id: number, data: UpdateChatDto, userId: number) {
    const profile = await this.prisma.technician_profiles.findUnique({
      where: { user_id: userId },
    });

    const chat = await this.prisma.chats.findUnique({ where: { id } });
    if (!chat) throw new NotFoundException('Chat not found');

    const isParticipant =
      chat.client_id === userId || chat.technician_id === profile?.id;

    if (!isParticipant)
      throw new ForbiddenException('You can only update your own chat');

    return this.prisma.chats.update({
      where: { id },
      data: {
        status: data.status,
      },
    });
  }

  async remove(id: number, userId: number) {
    const profile = await this.prisma.technician_profiles.findUnique({
      where: { user_id: userId },
    });

    const chat = await this.prisma.chats.findUnique({ where: { id } });

    if (!chat || (chat.status as Status) === Status.ELIMINADO)
      throw new NotFoundException('Chat not found');

    const isParticipant =
      chat.client_id === userId || chat.technician_id === profile?.id;

    if (!isParticipant)
      throw new ForbiddenException('You can only delete your own chat');

    return this.prisma.chats.update({
      where: { id },
      data: { status: Status.ELIMINADO },
    });
  }
}
