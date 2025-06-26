import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticatedRequest } from 'src/common/types/auth-request';

@Injectable()
export class AuthUserGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const sub = request.auth?.payload?.sub;

    if (!sub) throw new UnauthorizedException('Invalid Auth0 token');

    const user = await this.prisma.users.findUnique({
      where: { auth0_id: sub },
    });

    if (!user) throw new UnauthorizedException('User not found in database');

    request.user = user;

    return true;
  }
}
