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
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthUserId } from 'src/common/decorators/auth-user-id.decorator';
import { UserRole } from '@prisma/client';
import { AuthUserGuard } from '../auth/guards/auth-user.guard';

@UseGuards(JwtAuthGuard, AuthUserGuard, RolesGuard)
@Controller('chats')
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Post()
  @Roles(UserRole.client, UserRole.technician)
  create(@Body() dto: CreateChatDto, @AuthUserId() userId: number) {
    return this.service.create(dto, userId);
  }

  @Get()
  @Roles(UserRole.client, UserRole.technician, UserRole.admin)
  findAll(@AuthUserId() userId: number) {
    return this.service.findAllForUser(userId);
  }

  @Get(':id')
  @Roles(UserRole.client, UserRole.technician, UserRole.admin)
  findOne(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.findOne(+id, userId);
  }

  @Patch(':id')
  @Roles(UserRole.client, UserRole.technician, UserRole.admin)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateChatDto,
    @AuthUserId() userId: number,
  ) {
    return this.service.update(+id, dto, userId);
  }

  @Delete(':id')
  @Roles(UserRole.client, UserRole.technician, UserRole.admin)
  remove(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.remove(+id, userId);
  }
}
