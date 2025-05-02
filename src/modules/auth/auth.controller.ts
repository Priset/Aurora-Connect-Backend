import {
  Controller,
  Post,
  Body,
  Req,
  UnauthorizedException,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from 'src/common/types/auth-request';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(
    @Req() req: AuthenticatedRequest,
    @Body()
    body: {
      name: string;
      last_name: string;
      email: string;
      role: 'client' | 'technician';
    },
  ) {
    const payload = req.auth?.payload;
    if (!payload?.sub) {
      throw new UnauthorizedException('Missing Auth0 data in token');
    }

    const auth0Id: string = payload.sub;

    return this.authService.findOrCreateUserByAuth0Id(auth0Id, {
      name: body.name,
      last_name: body.last_name,
      email: body.email,
      role: body.role,
    });
  }

  @Get('me')
  async getMyProfile(@Req() req: AuthenticatedRequest) {
    const payload = req.auth?.payload;

    if (!payload?.sub) {
      throw new UnauthorizedException('Missing Auth0 ID in token');
    }

    return this.authService.getUserByAuth0Id(payload.sub);
  }
}
