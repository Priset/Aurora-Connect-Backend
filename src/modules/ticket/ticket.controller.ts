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
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUserInterceptor } from '../../common/interceptors/auth-user.interceptor';
import { AuthUserId } from '../../common/decorators/auth-user-id.decorator';
import { Status } from '../../common/enums/status.enum';

@UseGuards(JwtAuthGuard)
@UseInterceptors(AuthUserInterceptor)
@Controller('tickets')
export class TicketController {
  constructor(private readonly service: TicketService) {}

  @Post()
  create(@Body() dto: CreateTicketDto, @AuthUserId() userId: number) {
    return this.service.create(dto, userId);
  }

  @Post('/from-request/:requestId')
  createFromRequest(@Param('requestId') requestId: string) {
    return this.service.createFromRequest(+requestId);
  }

  @Get()
  findAll(@AuthUserId() userId: number) {
    return this.service.findAllForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.findOne(+id, userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: Status,
    @AuthUserId() userId: number,
  ) {
    return this.service.updateStatus(+id, status, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTicketDto,
    @AuthUserId() userId: number,
  ) {
    return this.service.update(+id, dto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.remove(+id, userId);
  }
}
