import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  enableShutdownHooks() {
    process.on('SIGINT', () => {
      this.$disconnect()
        .then(() => console.log('🛑 Prisma disconnected on SIGINT'))
        .catch((err) => console.error('❌ Error disconnecting Prisma', err));
    });

    process.on('SIGTERM', () => {
      this.$disconnect()
        .then(() => console.log('🛑 Prisma disconnected on SIGTERM'))
        .catch((err) => console.error('❌ Error disconnecting Prisma', err));
    });
  }
}
