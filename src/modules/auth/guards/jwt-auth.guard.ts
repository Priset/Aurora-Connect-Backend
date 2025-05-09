import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { auth } from 'express-oauth2-jwt-bearer';
import { Request, Response } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
    tokenSigningAlg: 'RS256',
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    return new Promise((resolve, reject) => {
      this.checkJwt(req, res, (err?: unknown) => {
        if (err) {
          reject(new UnauthorizedException('Invalid or missing token'));
        } else {
          if (!req.auth) {
            reject(new UnauthorizedException('Auth payload missing'));
          } else {
            resolve(true);
          }
        }
      });
    });
  }
}
