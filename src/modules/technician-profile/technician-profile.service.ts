import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTechnicianProfileDto } from './dto/create-technician-profile.dto';
import { UpdateTechnicianProfileDto } from './dto/update-technician-profile.dto';
import { Status } from '../../common/enums/status.enum';
import { UserRole } from '@prisma/client';

@Injectable()
export class TechnicianProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTechnicianProfileDto, userId: number) {
    const existing = await this.prisma.technician_profiles.findUnique({
      where: { user_id: userId },
    });

    if (existing) {
      throw new ConflictException('Technician profile already exists');
    }

    return this.prisma.technician_profiles.create({
      data: {
        user_id: userId,
        experience: data.experience,
        years_experience: data.years_experience,
        status: data.status ?? Status.DESHABILITADO,
      },
    });
  }

  async findAll() {
    return this.prisma.technician_profiles.findMany({
      where: {
        NOT: { status: Status.ELIMINADO },
      },
      include: { user: true },
    });
  }

  async findOne(id: number, userId: number) {
    const profile = await this.prisma.technician_profiles.findUnique({
      where: { id },
      include: { user: true, service_reviews: true },
    });

    if (!profile || (profile.status as Status) === Status.ELIMINADO)
      throw new NotFoundException('Technician profile not found');
    if (profile.user_id !== userId)
      throw new ForbiddenException('Access denied');

    return profile;
  }

  async update(id: number, data: UpdateTechnicianProfileDto, userId: number) {
    const profile = await this.prisma.technician_profiles.findUnique({
      where: { id },
    });

    if (!profile) throw new NotFoundException('Technician profile not found');

    if (profile.user_id !== userId) {
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });
      if (!user || user.role !== UserRole.admin) {
        throw new ForbiddenException('You can only update your own profile');
      }
    }

    return this.prisma.technician_profiles.update({
      where: { id },
      data: {
        experience: data.experience,
        years_experience: data.years_experience,
        status: data.status,
      },
    });
  }

  async remove(id: number, userId: number) {
    const profile = await this.prisma.technician_profiles.findUnique({
      where: { id },
    });

    if (!profile || (profile.status as Status) === Status.ELIMINADO)
      throw new NotFoundException('Technician profile not found');

    if (profile.user_id !== userId) {
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });
      if (!user || user.role !== UserRole.admin) {
        throw new ForbiddenException('You can only delete your own profile');
      }
    }

    return this.prisma.technician_profiles.update({
      where: { id },
      data: { status: Status.ELIMINADO },
    });
  }
}
