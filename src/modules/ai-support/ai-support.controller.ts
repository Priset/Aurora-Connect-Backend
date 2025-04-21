import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AiSupportService } from './ai-support.service';
import { CreateAiSupportChatDto } from './dto/create-ai-support-chat.dto';
import { UpdateAiSupportChatDto } from './dto/update-ai-support-chat.dto';

@Controller('ai-support-chats')
export class AiSupportController {
  constructor(private readonly service: AiSupportService) {}

  @Post()
  create(@Body() dto: CreateAiSupportChatDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAiSupportChatDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
