import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAiSupportChatDto } from './dto/create-ai-support-chat.dto';
import { UpdateAiSupportChatDto } from './dto/update-ai-support-chat.dto';

@Injectable()
export class AiSupportService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateAiSupportChatDto) {
    return this.prisma.ai_support_chats.create({
      data: {
        user_id: data.userId,
        status: data.status ?? 0,
      },
    });
  }

  findAll() {
    return this.prisma.ai_support_chats.findMany({
      include: { user: true },
    });
  }

  findOne(id: number) {
    return this.prisma.ai_support_chats.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async update(id: number, data: UpdateAiSupportChatDto) {
    const chat = await this.prisma.ai_support_chats.findUnique({
      where: { id },
    });
    if (!chat) throw new NotFoundException('AI Support Chat not found');

    return this.prisma.ai_support_chats.update({
      where: { id },
      data: {
        status: data.status,
      },
    });
  }

  async remove(id: number) {
    const chat = await this.prisma.ai_support_chats.findUnique({
      where: { id },
    });
    if (!chat) throw new NotFoundException('AI Support Chat not found');

    return this.prisma.ai_support_chats.delete({ where: { id } });
  }
}
