import { Request } from 'express';
import { AuthResult } from 'express-oauth2-jwt-bearer';
import { users } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  auth: AuthResult;
  user?: users;
}
