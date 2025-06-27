import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthUserId } from 'src/common/decorators/auth-user-id.decorator';
import { UserRole } from '@prisma/client';
import { AuthUserGuard } from '../auth/guards/auth-user.guard';

@UseGuards(JwtAuthGuard, AuthUserGuard, RolesGuard)
@Controller('chat-messages')
export class ChatMessageController {
  constructor(private readonly service: ChatMessageService) {}

  @Post()
  @Roles(UserRole.client, UserRole.technician)
  create(@Body() dto: CreateChatMessageDto, @AuthUserId() userId: number) {
    return this.service.create(dto, userId);
  }

  @Get()
  @Roles(UserRole.client, UserRole.technician, UserRole.admin)
  findAll(@Query('chatId') chatId: string, @AuthUserId() userId: number) {
    const parsed = Number(chatId);
    return this.service.findAllForChat(parsed, userId);
  }

  @Get(':id')
  @Roles(UserRole.client, UserRole.technician, UserRole.admin)
  findOne(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.findOne(+id, userId);
  }

  @Patch(':id')
  @Roles(UserRole.client, UserRole.technician)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateChatMessageDto,
    @AuthUserId() userId: number,
  ) {
    return this.service.update(+id, dto, userId);
  }

  @Delete(':id')
  @Roles(UserRole.client, UserRole.technician)
  remove(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.remove(+id, userId);
  }
}
