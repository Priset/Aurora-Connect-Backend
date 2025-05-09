import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAiSupportMessageDto } from './dto/create-ai-support-message.dto';
import { UpdateAiSupportMessageDto } from './dto/update-ai-support-message.dto';

@Injectable()
export class AiSupportMessageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAiSupportMessageDto, userId: number) {
    const chat = await this.prisma.ai_support_chats.findUnique({
      where: { id: data.chatId },
    });

    if (!chat) throw new NotFoundException('Chat not found');
    if (chat.user_id !== userId)
      throw new ForbiddenException('Access denied to this chat');

    return this.prisma.ai_support_messages.create({
      data: {
        chat_id: data.chatId,
        role: data.role, // "user" o "assistant"
        content: data.content,
        status: typeof data.status === 'number' ? data.status : 0,
      },
    });
  }

  async findAllForChat(chatId: number, userId: number) {
    const chat = await this.prisma.ai_support_chats.findUnique({
      where: { id: chatId },
    });

    if (!chat) throw new NotFoundException('Chat not found');
    if (chat.user_id !== userId)
      throw new ForbiddenException('Access denied to chat messages');

    return this.prisma.ai_support_messages.findMany({
      where: { chat_id: chatId },
      include: { chat: true },
      orderBy: { sent_at: 'asc' },
    });
  }

  async findOne(id: number, userId: number) {
    const msg = await this.prisma.ai_support_messages.findUnique({
      where: { id },
      include: { chat: true },
    });

    if (!msg) throw new NotFoundException('Message not found');
    if (msg.chat.user_id !== userId)
      throw new ForbiddenException('Access denied to this message');

    return msg;
  }

  async update(id: number, data: UpdateAiSupportMessageDto, userId: number) {
    const msg = await this.prisma.ai_support_messages.findUnique({
      where: { id },
      include: { chat: true },
    });

    if (!msg) throw new NotFoundException('Message not found');
    if (msg.chat.user_id !== userId)
      throw new ForbiddenException('You can only update your own AI messages');

    return this.prisma.ai_support_messages.update({
      where: { id },
      data: {
        content: data.content,
        status: data.status,
      },
    });
  }

  async remove(id: number, userId: number) {
    const msg = await this.prisma.ai_support_messages.findUnique({
      where: { id },
      include: { chat: true },
    });

    if (!msg) throw new NotFoundException('Message not found');
    if (msg.chat.user_id !== userId)
      throw new ForbiddenException('You can only delete your own AI messages');

    return this.prisma.ai_support_messages.delete({
      where: { id },
    });
  }
}
