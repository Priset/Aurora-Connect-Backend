import { UserRole } from '@prisma/client';

export class User {
  id: number;
  auth0_id: string;
  name: string;
  last_name: string;
  email: string;
  role: UserRole;
  status: number;
  created_at: Date;
  updated_at: Date;
}
