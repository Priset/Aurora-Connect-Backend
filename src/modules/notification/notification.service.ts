import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateNotificationDto, userId: number) {
    return this.prisma.notifications.create({
      data: {
        user_id: userId,
        content: data.content,
        status: typeof data.status === 'number' ? data.status : 0,
      },
    });
  }

  async findAllForUser(userId: number) {
    return this.prisma.notifications.findMany({
      where: { user_id: userId },
      include: { user: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const notif = await this.prisma.notifications.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!notif) throw new NotFoundException('Notification not found');
    if (notif.user_id !== userId)
      throw new ForbiddenException('Access denied to this notification');

    return notif;
  }

  async update(id: number, data: UpdateNotificationDto, userId: number) {
    const notif = await this.prisma.notifications.findUnique({
      where: { id },
    });

    if (!notif) throw new NotFoundException('Notification not found');
    if (notif.user_id !== userId)
      throw new ForbiddenException(
        'You can only update your own notifications',
      );

    return this.prisma.notifications.update({
      where: { id },
      data: {
        content: data.content,
        status: data.status,
      },
    });
  }

  async remove(id: number, userId: number) {
    const notif = await this.prisma.notifications.findUnique({
      where: { id },
    });

    if (!notif) throw new NotFoundException('Notification not found');
    if (notif.user_id !== userId)
      throw new ForbiddenException(
        'You can only delete your own notifications',
      );

    return this.prisma.notifications.delete({ where: { id } });
  }
}
