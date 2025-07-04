import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { Status } from '../../common/enums/status.enum';
import { ChatGateway } from './chat-message.gateway';

@Injectable()
export class ChatMessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: ChatGateway,
  ) {}

  async create(data: CreateChatMessageDto, userId: number) {
    const chat = await this.prisma.chats.findUnique({
      where: { id: data.chatId },
    });

    if (!chat) throw new NotFoundException('Chat not found');

    const technicianProfile = await this.prisma.technician_profiles.findUnique({
      where: { user_id: userId },
    });

    const isParticipant =
      chat.client_id === userId || chat.technician_id === technicianProfile?.id;

    if (!isParticipant)
      throw new ForbiddenException('You are not part of this chat');

    const message = await this.prisma.chat_messages.create({
      data: {
        chat_id: data.chatId,
        sender_id: userId,
        message: data.message,
        status:
          typeof data.status === 'number' ? data.status : Status.HABILITADO,
      },
      include: {
        sender: true,
      },
    });

    this.gateway.emitNewMessage(data.chatId, message);

    return message;
  }

  async findAllForChat(chatId: number, userId: number) {
    if (!chatId || isNaN(chatId)) {
      throw new NotFoundException('Chat ID is invalid or missing');
    }

    const chat = await this.prisma.chats.findUnique({
      where: { id: chatId },
    });

    if (!chat) throw new NotFoundException('Chat not found');

    const technicianProfile = await this.prisma.technician_profiles.findUnique({
      where: { user_id: userId },
    });

    const isParticipant =
      chat.client_id === userId || chat.technician_id === technicianProfile?.id;

    if (!isParticipant)
      throw new ForbiddenException('Access denied to chat messages');

    return this.prisma.chat_messages.findMany({
      where: {
        chat_id: chatId,
        NOT: { status: Status.ELIMINADO },
      },
      include: {
        chat: true,
        sender: true,
      },
      orderBy: { sent_at: 'asc' },
    });
  }

  async findOne(id: number, userId: number) {
    const message = await this.prisma.chat_messages.findUnique({
      where: { id },
      include: { chat: true, sender: true },
    });

    if (!message || (message.status as Status) === Status.ELIMINADO)
      throw new NotFoundException('Message not found');

    const chat = message.chat;

    const technicianProfile = await this.prisma.technician_profiles.findUnique({
      where: { user_id: userId },
    });

    const isParticipant =
      chat.client_id === userId || chat.technician_id === technicianProfile?.id;

    if (!isParticipant)
      throw new ForbiddenException('Access denied to this message');

    return message;
  }

  async update(id: number, data: UpdateChatMessageDto, userId: number) {
    const message = await this.prisma.chat_messages.findUnique({
      where: { id },
    });

    if (!message) throw new NotFoundException('Message not found');
    if (message.sender_id !== userId)
      throw new ForbiddenException('You can only edit your own message');

    return this.prisma.chat_messages.update({
      where: { id },
      data: {
        message: data.message,
        status: data.status,
      },
    });
  }

  async remove(id: number, userId: number) {
    const message = await this.prisma.chat_messages.findUnique({
      where: { id },
    });

    if (!message) throw new NotFoundException('Message not found');
    if (message.sender_id !== userId)
      throw new ForbiddenException('You can only delete your own message');

    return this.prisma.chat_messages.update({
      where: { id },
      data: { status: Status.ELIMINADO },
    });
  }
}
