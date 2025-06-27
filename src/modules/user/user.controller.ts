import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthUser } from '../../common/decorators/auth-user.decorator';
import { users, UserRole } from '@prisma/client';
import { AuthUserGuard } from '../auth/guards/auth-user.guard';

@UseGuards(JwtAuthGuard, AuthUserGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@AuthUser() user: users) {
    return user;
  }

  @Get()
  @Roles(UserRole.admin)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.admin, UserRole.client, UserRole.technician)
  findOne(@Param('id') id: string, @AuthUser() user: users) {
    if (user.role !== 'admin' && user.id !== +id) {
      throw new ForbiddenException('Access denied');
    }
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.admin, UserRole.client, UserRole.technician)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @AuthUser() user: users,
  ) {
    if (user.role !== 'admin' && user.id !== +id) {
      throw new ForbiddenException('Access denied');
    }
    return this.userService.update(+id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
