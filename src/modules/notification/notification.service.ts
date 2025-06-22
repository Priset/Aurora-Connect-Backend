import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationGateway } from './notification.gateway';
import { Status } from 'src/common/enums/status.enum';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: NotificationGateway,
  ) {}

  async create(data: CreateNotificationDto) {
    const notification = await this.prisma.notifications.create({
      data: {
        user_id: data.user_id,
        content: data.content,
        status: data.status ?? Status.DESHABILITADO,
      },
    });

    this.gateway.emitNewNotification(notification);
    return notification;
  }

  async findAllForUser(userId: number) {
    return this.prisma.notifications.findMany({
      where: {
        user_id: userId,
        NOT: { status: Status.ELIMINADO },
      },
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

  async markAllAsRead(userId: number) {
    return this.prisma.notifications.updateMany({
      where: {
        user_id: userId,
        status: Status.DESHABILITADO,
      },
      data: {
        status: Status.HABILITADO,
      },
    });
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

  async removeAllRead(userId: number) {
    return this.prisma.notifications.updateMany({
      where: {
        user_id: userId,
        status: Status.HABILITADO,
      },
      data: {
        status: Status.ELIMINADO,
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

    return this.prisma.notifications.update({
      where: { id },
      data: { status: Status.ELIMINADO },
    });
  }
}
