import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AiSupportMessageService } from './ai-support-message.service';
import { CreateAiSupportMessageDto } from './dto/create-ai-support-message.dto';
import { UpdateAiSupportMessageDto } from './dto/update-ai-support-message.dto';

@Controller('ai-support-messages')
export class AiSupportMessageController {
  constructor(private readonly service: AiSupportMessageService) {}

  @Post()
  create(@Body() dto: CreateAiSupportMessageDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateAiSupportMessageDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
