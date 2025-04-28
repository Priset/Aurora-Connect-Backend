import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Observable } from 'rxjs';
import { AuthenticatedRequest } from 'src/common/types/auth-request';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const sub = req.auth?.payload?.sub;

    if (!sub) throw new UnauthorizedException('Invalid Auth0 token');

    const user = await this.prisma.users.findUnique({
      where: { auth0_id: sub },
    });

    if (!user) throw new UnauthorizedException('User not found in database');

    req.user = user;

    return next.handle();
  }
}
