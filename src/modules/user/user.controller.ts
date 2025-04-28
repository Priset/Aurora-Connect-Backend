import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUserInterceptor } from '../../common/interceptors/auth-user.interceptor';
import { AuthUser } from '../../common/decorators/auth-user.decorator';
import { users } from '@prisma/client';
import { AuthUserId } from '../../common/decorators/auth-user-id.decorator';

@UseGuards(JwtAuthGuard)
@UseInterceptors(AuthUserInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@AuthUser() user: users) {
    return user;
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AuthUserId() userId: number) {
    if (+id !== userId) throw new ForbiddenException('Access denied');
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @AuthUserId() userId: number,
  ) {
    if (+id !== userId) throw new ForbiddenException('Access denied');
    return this.userService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUserId() userId: number) {
    if (+id !== userId) throw new ForbiddenException('Access denied');
    return this.userService.remove(+id);
  }
}
