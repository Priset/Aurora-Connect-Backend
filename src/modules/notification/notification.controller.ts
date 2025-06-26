import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthUserId } from 'src/common/decorators/auth-user-id.decorator';
import { UserRole } from '@prisma/client';
import { AuthUserGuard } from '../auth/guards/auth-user.guard';

@UseGuards(JwtAuthGuard, AuthUserGuard, RolesGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Post()
  @Roles(UserRole.admin, UserRole.client, UserRole.technician)
  create(@Body() dto: CreateNotificationDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(UserRole.admin, UserRole.client, UserRole.technician)
  findAll(@AuthUserId() userId: number) {
    return this.service.findAllForUser(userId);
  }

  @Get(':id')
  @Roles(UserRole.admin, UserRole.client, UserRole.technician)
  findOne(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.findOne(+id, userId);
  }

  @Patch('mark-all-as-read')
  @Roles(UserRole.admin, UserRole.client, UserRole.technician)
  markAllAsRead(@AuthUserId() userId: number) {
    return this.service.markAllAsRead(userId);
  }

  @Patch(':id')
  @Roles(UserRole.admin, UserRole.client, UserRole.technician)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateNotificationDto,
    @AuthUserId() userId: number,
  ) {
    return this.service.update(+id, dto, userId);
  }

  @Delete('clear-read')
  @Roles(UserRole.admin, UserRole.client, UserRole.technician)
  clearRead(@AuthUserId() userId: number) {
    return this.service.removeAllRead(userId);
  }

  @Delete(':id')
  @Roles(UserRole.admin, UserRole.client, UserRole.technician)
  remove(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.remove(+id, userId);
  }
}
