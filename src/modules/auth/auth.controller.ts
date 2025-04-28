import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from 'src/common/types/auth-request';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  async getMyProfile(@Req() req: AuthenticatedRequest) {
    const auth0Id = req.auth?.payload?.sub;

    if (!auth0Id) {
      throw new UnauthorizedException('Missing Auth0 ID in token');
    }

    return this.authService.findOrCreateUserByAuth0Id(auth0Id);
  }
}
