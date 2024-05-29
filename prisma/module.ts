import { Logger, Module } from '@nestjs/common';
import { PrismaService } from './service';

/**
 * The PrismaModule is a Nest.js module that provides the PrismaService as a provider and exports it for use in other parts of the application.
 * The PrismaService is a wrapper around the Prisma ORM, which provides a type-safe interface for interacting with a database.
 * By including this module in other Nest.js modules, the PrismaService can be easily injected and used for database operations.
 */
@Module({
  providers: [PrismaService, Logger],
  exports: [PrismaService],
})
export class PrismaModule {}
