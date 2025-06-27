import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status } from 'src/common/enums/status.enum';

interface Auth0Profile {
  name: string;
  last_name: string;
  email: string;
  role?: 'client' | 'technician' | 'admin';
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateUserByAuth0Id(auth0Id: string, profile: Auth0Profile) {
    let user = await this.prisma.users.findUnique({
      where: { auth0_id: auth0Id },
    });

    if (!user) {
      user = await this.prisma.users.create({
        data: {
          auth0_id: auth0Id,
          name: profile.name,
          last_name: profile.last_name,
          email: profile.email,
          role: profile.role ?? 'client',
          status: Status.HABILITADO,
        },
      });
    }

    return user;
  }

  async getUserByAuth0Id(auth0Id: string) {
    return this.prisma.users.findUnique({
      where: { auth0_id: auth0Id },
      include: {
        technicianProfile: true,
      },
    });
  }
}
