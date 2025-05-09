import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Status } from '../../common/enums/status.enum';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateUserDto) {
    return this.prisma.users.create({ data });
  }

  findAll() {
    return this.prisma.users.findMany({
      where: { NOT: { status: Status.ELIMINADO } },
    });
  }

  findOne(id: number) {
    return this.prisma.users.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateUserDto) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.users.update({ where: { id }, data });
  }

  async remove(id: number) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user || user.status === Number(Status.ELIMINADO))
      throw new NotFoundException('User not found');
    return this.prisma.users.update({
      where: { id },
      data: { status: Status.ELIMINADO },
    });
  }
}
