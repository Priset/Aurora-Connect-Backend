import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateNotificationDto) {
    return this.prisma.notifications.create({
      data: {
        user_id: data.userId,
        content: data.content,
        status: data.status ?? 0,
      },
    });
  }

  findAll() {
    return this.prisma.notifications.findMany({
      include: { user: true },
      orderBy: { created_at: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.notifications.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async update(id: number, data: UpdateNotificationDto) {
    const notif = await this.prisma.notifications.findUnique({ where: { id } });
    if (!notif) throw new NotFoundException('Notification not found');

    return this.prisma.notifications.update({
      where: { id },
      data: {
        content: data.content,
        status: data.status,
      },
    });
  }

  async remove(id: number) {
    const notif = await this.prisma.notifications.findUnique({ where: { id } });
    if (!notif) throw new NotFoundException('Notification not found');

    return this.prisma.notifications.delete({ where: { id } });
  }
}
