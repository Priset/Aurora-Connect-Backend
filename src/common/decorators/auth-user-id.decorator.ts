import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/common/types/auth-request';

export const AuthUserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user?.id;

    if (typeof userId !== 'number') {
      throw new UnauthorizedException('User ID not found in request');
    }

    return userId;
  },
);
