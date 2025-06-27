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
  UseInterceptors,
} from '@nestjs/common';
import { AiSupportMessageService } from './ai-support-message.service';
import { CreateAiSupportMessageDto } from './dto/create-ai-support-message.dto';
import { UpdateAiSupportMessageDto } from './dto/update-ai-support-message.dto';
import { BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AuthUserId } from 'src/common/decorators/auth-user-id.decorator';
import { AuthUserInterceptor } from 'src/common/interceptors/auth-user.interceptor';

@UseGuards(JwtAuthGuard)
@UseInterceptors(AuthUserInterceptor)
@Controller('ai-support-messages')
export class AiSupportMessageController {
  constructor(private readonly service: AiSupportMessageService) {}

  @Post()
  create(@Body() dto: CreateAiSupportMessageDto, @AuthUserId() userId: number) {
    return this.service.create(dto, userId);
  }

  @Get()
  findAll(@Query('chatId') chatId: string, @AuthUserId() userId: number) {
    const parsedId = Number(chatId);
    if (!parsedId || isNaN(parsedId)) {
      throw new BadRequestException('Invalid chatId');
    }
    return this.service.findAllForChat(parsedId, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.findOne(+id, userId);
  }

  @Post('ai')
  async chatIA(
    @Body() body: { chatId: number; prompt: string },
    @AuthUserId() userId: number,
  ) {
    return this.service.chatWithAI(body.chatId, userId, body.prompt);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAiSupportMessageDto,
    @AuthUserId() userId: number,
  ) {
    return this.service.update(+id, dto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.remove(+id, userId);
  }
}
