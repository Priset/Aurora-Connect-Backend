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
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthUserId } from 'src/common/decorators/auth-user-id.decorator';
import { UserRole } from '@prisma/client';
import { AuthUserGuard } from '../auth/guards/auth-user.guard';

@UseGuards(JwtAuthGuard, AuthUserGuard, RolesGuard)
@Controller('reviews')
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @Post()
  @Roles(UserRole.client, UserRole.admin)
  create(@Body() dto: CreateReviewDto, @AuthUserId() userId: number) {
    return this.service.create(dto, userId);
  }

  @Get()
  @Roles(UserRole.admin, UserRole.client, UserRole.technician)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(UserRole.client, UserRole.admin, UserRole.technician)
  findOne(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.findOne(+id, userId);
  }

  @Patch(':id')
  @Roles(UserRole.client, UserRole.admin)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
    @AuthUserId() userId: number,
  ) {
    return this.service.update(+id, dto, userId);
  }

  @Delete(':id')
  @Roles(UserRole.client, UserRole.admin)
  remove(@Param('id') id: string, @AuthUserId() userId: number) {
    return this.service.remove(+id, userId);
  }
}
