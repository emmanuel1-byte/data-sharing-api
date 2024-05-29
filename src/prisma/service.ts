import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * The `PrismaService` class is an injectable service that extends the `PrismaClient` class and implements the `OnModuleInit` interface.
 * It is responsible for connecting to the Prisma database when the module is initialized.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
