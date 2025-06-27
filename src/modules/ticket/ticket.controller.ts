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
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthUserId } from '../../common/decorators/auth-user-id.decorator';
import { Status } from '../../common/enums/status.enum';
import { UserRole } from '@prisma/client';
import { AuthUserGuard } from '../auth/guards/auth-user.guard';

@UseGuards(JwtAuthGuard, AuthUserGuard, RolesGuard)
@Controller('tickets')
export class TicketController {
  constructor(private readonly service: TicketService) {}

  @Post()
  @Roles(UserRole.client, UserRole.admin)
  create(@Body() dto: CreateTicketDto, @AuthUserId() userId: number) {
    return this.service.create(dto, userId);
  }

  @Post('/from-request/:requestId')
  @Roles(UserRole.client, UserRole.admin)
  createFromRequest(@Param('requestId') requestId: string) {
    return this.service.createFromRequest(+requestId);
  }

  @Get()
  @Roles(UserRole.client, UserRole.admin, UserRole.technician)
  findAll(@AuthUserId() userId: number) {
    return this.service.findAllForUser(userId);
  }

  @Get(':id')
  @Roles(UserRole.client, UserRole.technician, UserRole.admin)
  findOne(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.findOne(+id, userId);
  }

  @Patch(':id/status')
  @Roles(UserRole.technician, UserRole.admin, UserRole.client)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: Status,
    @AuthUserId() userId: number,
  ) {
    return this.service.updateStatus(+id, status, userId);
  }

  @Patch(':id')
  @Roles(UserRole.admin, UserRole.client, UserRole.technician)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTicketDto,
    @AuthUserId() userId: number,
  ) {
    return this.service.update(+id, dto, userId);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  remove(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.remove(+id, userId);
  }
}
