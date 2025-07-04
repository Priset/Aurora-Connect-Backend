import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status } from 'src/common/enums/status.enum';

@Injectable()
export class ServicePublicService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTechniciansPublic() {
    return this.prisma.technician_profiles.findMany({
      where: {
        status: { not: Status.ELIMINADO },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            last_name: true,
            email: true,
            role: true,
          },
        },
        service_reviews: {
          where: { status: { not: Status.ELIMINADO } },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async getTechnicianProfilePublic(id: number) {
    const profile = await this.prisma.technician_profiles.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            last_name: true,
            email: true,
            role: true,
          },
        },
        service_reviews: {
          where: { status: { not: Status.ELIMINADO } },
        },
      },
    });

    if (!profile || (profile.status as Status) === Status.ELIMINADO) {
      throw new NotFoundException('Technician profile not found');
    }

    return profile;
  }

  async getRequestPublicById(id: number) {
    const request = await this.prisma.service_requests.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            name: true,
            last_name: true,
          },
        },
        serviceOffers: {
          select: {
            id: true,
            technician_id: true,
            proposed_price: true,
            status: true,
          },
        },
      },
    });

    if (!request || (request.status as Status) === Status.ELIMINADO) {
      throw new NotFoundException('Service request not found');
    }

    return request;
  }
}
