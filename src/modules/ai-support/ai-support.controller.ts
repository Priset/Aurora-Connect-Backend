import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AiSupportService } from './ai-support.service';
import { CreateAiSupportChatDto } from './dto/create-ai-support-chat.dto';
import { UpdateAiSupportChatDto } from './dto/update-ai-support-chat.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AuthUserId } from 'src/common/decorators/auth-user-id.decorator';
import { AuthUserInterceptor } from 'src/common/interceptors/auth-user.interceptor';

@UseGuards(JwtAuthGuard)
@UseInterceptors(AuthUserInterceptor)
@Controller('ai-support-chats')
export class AiSupportController {
  constructor(private readonly service: AiSupportService) {}

  @Post()
  create(@Body() dto: CreateAiSupportChatDto, @AuthUserId() userId: number) {
    return this.service.create(dto, userId);
  }

  @Get()
  findAll(@AuthUserId() userId: number) {
    return this.service.findAllForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAiSupportChatDto,
    @AuthUserId() userId: number,
  ) {
    return this.service.update(+id, dto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.remove(+id, userId);
  }
}
