import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAiSupportMessageDto } from './dto/create-ai-support-message.dto';
import { UpdateAiSupportMessageDto } from './dto/update-ai-support-message.dto';

@Injectable()
export class AiSupportMessageService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateAiSupportMessageDto) {
    return this.prisma.ai_support_messages.create({
      data: {
        chat_id: data.chatId,
        role: data.role,
        content: data.content,
        status: data.status ?? 0,
      },
    });
  }

  findAll() {
    return this.prisma.ai_support_messages.findMany({
      include: {
        chat: true,
      },
      orderBy: { sent_at: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.ai_support_messages.findUnique({
      where: { id },
      include: {
        chat: true,
      },
    });
  }

  async update(id: number, data: UpdateAiSupportMessageDto) {
    const message = await this.prisma.ai_support_messages.findUnique({
      where: { id },
    });
    if (!message) throw new NotFoundException('AI Support Message not found');

    return this.prisma.ai_support_messages.update({
      where: { id },
      data: {
        content: data.content,
        status: data.status,
      },
    });
  }

  async remove(id: number) {
    const message = await this.prisma.ai_support_messages.findUnique({
      where: { id },
    });
    if (!message) throw new NotFoundException('AI Support Message not found');

    return this.prisma.ai_support_messages.delete({ where: { id } });
  }
}
