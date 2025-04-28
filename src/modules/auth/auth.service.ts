import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateUserByAuth0Id(auth0Id: string) {
    let user = await this.prisma.users.findUnique({
      where: { auth0_id: auth0Id },
    });

    if (!user) {
      user = await this.prisma.users.create({
        data: {
          auth0_id: auth0Id,
          name: 'New User',
          last_name: '',
          email: '',
          role: 'client',
        },
      });
    }

    return user;
  }
}
