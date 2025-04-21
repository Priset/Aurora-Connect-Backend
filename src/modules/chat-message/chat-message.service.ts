import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';

@Injectable()
export class ChatMessageService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateChatMessageDto) {
    return this.prisma.chat_messages.create({
      data: {
        chat_id: data.chatId,
        sender_id: data.senderId,
        message: data.message,
        status: data.status ?? 0,
      },
    });
  }

  findAll() {
    return this.prisma.chat_messages.findMany({
      include: {
        chat: true,
        sender: true,
      },
      orderBy: { sent_at: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.chat_messages.findUnique({
      where: { id },
      include: {
        chat: true,
        sender: true,
      },
    });
  }

  async update(id: number, data: UpdateChatMessageDto) {
    const message = await this.prisma.chat_messages.findUnique({
      where: { id },
    });
    if (!message) throw new NotFoundException('Message not found');

    return this.prisma.chat_messages.update({
      where: { id },
      data: {
        message: data.message,
        status: data.status,
      },
    });
  }

  async remove(id: number) {
    const message = await this.prisma.chat_messages.findUnique({
      where: { id },
    });
    if (!message) throw new NotFoundException('Message not found');

    return this.prisma.chat_messages.delete({ where: { id } });
  }
}
