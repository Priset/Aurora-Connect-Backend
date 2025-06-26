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
import { TechnicianProfileService } from './technician-profile.service';
import { CreateTechnicianProfileDto } from './dto/create-technician-profile.dto';
import { UpdateTechnicianProfileDto } from './dto/update-technician-profile.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthUserId } from 'src/common/decorators/auth-user-id.decorator';
import { UserRole } from '@prisma/client';
import { AuthUserGuard } from '../auth/guards/auth-user.guard';

@UseGuards(JwtAuthGuard, AuthUserGuard, RolesGuard)
@Controller('technician-profiles')
export class TechnicianProfileController {
  constructor(private readonly service: TechnicianProfileService) {}

  @Post()
  @Roles(UserRole.technician, UserRole.admin)
  create(
    @Body() dto: CreateTechnicianProfileDto,
    @AuthUserId() userId: number,
  ) {
    return this.service.create(dto, userId);
  }

  @Get()
  @Roles(UserRole.admin)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(UserRole.technician, UserRole.admin)
  findOne(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.findOne(+id, userId);
  }

  @Patch(':id')
  @Roles(UserRole.technician, UserRole.admin)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTechnicianProfileDto,
    @AuthUserId() userId: number,
  ) {
    return this.service.update(+id, dto, userId);
  }

  @Delete(':id')
  @Roles(UserRole.admin, UserRole.technician)
  remove(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.remove(+id, userId);
  }
}
