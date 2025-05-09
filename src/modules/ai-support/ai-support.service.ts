import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAiSupportChatDto } from './dto/create-ai-support-chat.dto';
import { UpdateAiSupportChatDto } from './dto/update-ai-support-chat.dto';

@Injectable()
export class AiSupportService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAiSupportChatDto, userId: number) {
    return this.prisma.ai_support_chats.create({
      data: {
        user_id: userId,
        status: typeof data.status === 'number' ? data.status : 0,
      },
    });
  }

  async findAllForUser(userId: number) {
    return this.prisma.ai_support_chats.findMany({
      where: { user_id: userId },
      include: { user: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const chat = await this.prisma.ai_support_chats.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!chat) throw new NotFoundException('AI Support Chat not found');
    if (chat.user_id !== userId)
      throw new ForbiddenException('Access denied to this chat');

    return chat;
  }

  async update(id: number, data: UpdateAiSupportChatDto, userId: number) {
    const chat = await this.prisma.ai_support_chats.findUnique({
      where: { id },
    });

    if (!chat) throw new NotFoundException('AI Support Chat not found');
    if (chat.user_id !== userId)
      throw new ForbiddenException('You can only update your own AI chats');

    return this.prisma.ai_support_chats.update({
      where: { id },
      data: {
        status: data.status,
      },
    });
  }

  async remove(id: number, userId: number) {
    const chat = await this.prisma.ai_support_chats.findUnique({
      where: { id },
    });

    if (!chat) throw new NotFoundException('AI Support Chat not found');
    if (chat.user_id !== userId)
      throw new ForbiddenException('You can only delete your own AI chats');

    return this.prisma.ai_support_chats.delete({ where: { id } });
  }
}
