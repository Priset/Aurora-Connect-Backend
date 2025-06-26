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
import { ServiceRequestService } from './service-request.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthUserId } from 'src/common/decorators/auth-user-id.decorator';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';
import { UserRole } from '@prisma/client';
import { AuthUserGuard } from '../auth/guards/auth-user.guard';

@UseGuards(JwtAuthGuard, AuthUserGuard, RolesGuard)
@Controller('service-requests')
export class ServiceRequestController {
  constructor(private readonly service: ServiceRequestService) {}

  @Post()
  @Roles(UserRole.client)
  create(@Body() dto: CreateServiceRequestDto, @AuthUserId() userId: number) {
    return this.service.create(dto, userId);
  }

  @Get()
  @Roles(UserRole.client, UserRole.admin)
  findAll(@AuthUserId() userId: number) {
    return this.service.findAllForUser(userId);
  }

  @Get('all')
  @Roles(UserRole.technician, UserRole.admin, UserRole.client)
  findAllRequestsForTechnicians() {
    return this.service.findAllForTechnicians();
  }

  @Get(':id')
  @Roles(UserRole.client, UserRole.technician, UserRole.admin)
  findOne(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.findOne(+id, userId);
  }

  @Patch(':id')
  @Roles(UserRole.client, UserRole.admin)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateServiceRequestDto,
    @AuthUserId() userId: number,
  ) {
    return this.service.update(+id, dto, userId);
  }

  @Patch(':id/status')
  @Roles(UserRole.technician, UserRole.admin, UserRole.client)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRequestStatusDto,
    @AuthUserId() userId: number,
  ) {
    return this.service.updateStatus(+id, dto.status, userId);
  }

  @Patch(':id/finalize')
  @Roles(UserRole.client, UserRole.admin)
  finalize(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.finalizeRequest(+id, userId);
  }

  @Delete(':id')
  @Roles(UserRole.client, UserRole.admin)
  remove(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.remove(+id, userId);
  }
}
