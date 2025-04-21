import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTechnicianProfileDto } from './dto/create-technician-profile.dto';
import { UpdateTechnicianProfileDto } from './dto/update-technician-profile.dto';

@Injectable()
export class TechnicianProfileService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateTechnicianProfileDto) {
    const { userId, experience, yearsExperience } = data;

    return this.prisma.technician_profiles.create({
      data: {
        user_id: userId,
        experience,
        years_experience: yearsExperience,
      },
    });
  }

  findAll() {
    return this.prisma.technician_profiles.findMany({
      include: { user: true },
    });
  }

  findOne(id: number) {
    return this.prisma.technician_profiles.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async update(id: number, data: UpdateTechnicianProfileDto) {
    const profile = await this.prisma.technician_profiles.findUnique({
      where: { id },
    });
    if (!profile) throw new NotFoundException('Technician profile not found');
    return this.prisma.technician_profiles.update({ where: { id }, data });
  }

  async remove(id: number) {
    const profile = await this.prisma.technician_profiles.findUnique({
      where: { id },
    });
    if (!profile) throw new NotFoundException('Technician profile not found');
    return this.prisma.technician_profiles.delete({ where: { id } });
  }
}
