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
import { ServiceOfferService } from './service-offer.service';
import { CreateServiceOfferDto } from './dto/create-service-offer.dto';
import { UpdateServiceOfferDto } from './dto/update-service-offer.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthUserId } from 'src/common/decorators/auth-user-id.decorator';
import { UpdateRequestStatusDto } from '../service-request/dto/update-request-status.dto';
import { UserRole } from '@prisma/client';
import { AuthUserGuard } from '../auth/guards/auth-user.guard';

@UseGuards(JwtAuthGuard, AuthUserGuard, RolesGuard)
@Controller('service-offers')
export class ServiceOfferController {
  constructor(private readonly service: ServiceOfferService) {}

  @Post()
  @Roles(UserRole.technician)
  create(@Body() dto: CreateServiceOfferDto, @AuthUserId() userId: number) {
    return this.service.create(dto, userId);
  }

  @Get()
  @Roles(UserRole.technician, UserRole.admin)
  findAll(@AuthUserId() userId: number) {
    return this.service.findAllForTechnician(userId);
  }

  @Get(':id')
  @Roles(UserRole.technician, UserRole.admin)
  findOne(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.findOne(+id, userId);
  }

  @Patch(':id/status')
  @Roles(UserRole.technician, UserRole.client, UserRole.admin)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRequestStatusDto,
    @AuthUserId() userId: number,
  ) {
    return this.service.updateStatus(+id, dto.status, userId);
  }

  @Patch(':id')
  @Roles(UserRole.technician, UserRole.admin)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateServiceOfferDto,
    @AuthUserId() userId: number,
  ) {
    return this.service.update(+id, dto, userId);
  }

  @Delete(':id')
  @Roles(UserRole.technician, UserRole.admin)
  remove(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.remove(+id, userId);
  }
}
