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
import { ServiceRequestService } from './service-request.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AuthUserId } from 'src/common/decorators/auth-user-id.decorator';
import { AuthUserInterceptor } from 'src/common/interceptors/auth-user.interceptor';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';

@UseGuards(JwtAuthGuard)
@UseInterceptors(AuthUserInterceptor)
@Controller('service-requests')
export class ServiceRequestController {
  constructor(private readonly service: ServiceRequestService) {}

  @Post()
  create(@Body() dto: CreateServiceRequestDto, @AuthUserId() userId: number) {
    return this.service.create(dto, userId);
  }

  @Get()
  findAll(@AuthUserId() userId: number) {
    return this.service.findAllForUser(userId);
  }

  @Get('all')
  findAllRequestsForTechnicians() {
    return this.service.findAllForTechnicians();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateServiceRequestDto,
    @AuthUserId() userId: number,
  ) {
    return this.service.update(+id, dto, userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRequestStatusDto,
    @AuthUserId() userId: number,
  ) {
    return this.service.updateStatus(+id, dto.status, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.remove(+id, userId);
  }
}
