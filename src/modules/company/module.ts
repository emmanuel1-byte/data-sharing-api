import { Module } from '@nestjs/common';
import { CompanyService } from './service';
import { CompanyController } from './controller';
import { PrismaService } from 'src/prisma/service';

/**
 * The `CompanyModule` is a module that provides the necessary services and controllers for managing company-related functionality in the application.
 * It includes the `CompanyService` and `PrismaService` providers, as well as the `CompanyController` controller.
 */
@Module({
  providers: [CompanyService, PrismaService],
  controllers: [CompanyController],
})
export class CompanyModule {}
